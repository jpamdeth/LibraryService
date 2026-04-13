import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface ProposedChange {
  type: 'write' | 'edit';
  path: string;
  reason: string;
  oldString?: string;
  newString: string;
}

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.nyc_output',
]);

export class ToolExecutor {
  private _proposedChanges: ProposedChange[] = [];

  constructor(
    private readonly projectRoot: string,
    private readonly apply: boolean,
  ) {}

  get proposedChanges(): ProposedChange[] {
    return this._proposedChanges;
  }

  async execute(
    toolName: string,
    input: Record<string, unknown>,
  ): Promise<string> {
    try {
      switch (toolName) {
        case 'read_file':
          return this.readFile(input.path as string);
        case 'list_files':
          return this.listFiles(
            input.directory as string,
            input.pattern as string | undefined,
          );
        case 'search_code':
          return this.searchCode(
            input.pattern as string,
            input.directory as string,
            input.file_pattern as string | undefined,
          );
        case 'run_command':
          return this.runCommand(
            input.command as string,
            input.cwd as string | undefined,
          );
        case 'write_file':
          return this.writeFile(
            input.path as string,
            input.content as string,
            input.reason as string,
          );
        case 'edit_file':
          return this.editFile(
            input.path as string,
            input.old_string as string,
            input.new_string as string,
            input.reason as string,
          );
        default:
          return `Unknown tool: ${toolName}`;
      }
    } catch (err: unknown) {
      return `Tool error (${toolName}): ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  private resolve(filePath: string): string {
    return path.isAbsolute(filePath)
      ? filePath
      : path.join(this.projectRoot, filePath);
  }

  private readFile(filePath: string): string {
    const resolved = this.resolve(filePath);
    if (!fs.existsSync(resolved)) return `File not found: ${resolved}`;
    return fs.readFileSync(resolved, 'utf8');
  }

  private listFiles(directory: string, pattern?: string): string {
    const resolved = this.resolve(directory);
    if (!fs.existsSync(resolved)) return `Directory not found: ${resolved}`;
    const files = this.walk(resolved);
    const filtered = pattern
      ? files.filter((f) => this.matchGlob(f, pattern))
      : files;
    const relative = filtered.map((f) =>
      path.relative(this.projectRoot, f).replace(/\\/g, '/'),
    );
    return relative.length > 0 ? relative.join('\n') : '(no files found)';
  }

  private walk(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...this.walk(full));
      } else {
        results.push(full);
      }
    }
    return results;
  }

  private matchGlob(filePath: string, pattern: string): boolean {
    const normalized = filePath.replace(/\\/g, '/');
    const regexStr = pattern
      .replace(/[.+^${}()|[\]\\]/g, (c) =>
        c === '*' || c === '?' ? c : `\\${c}`,
      )
      .replace(/\*\*/g, '.+')
      .replace(/\*/g, '[^/]+')
      .replace(/\?/g, '[^/]');
    return new RegExp(`(^|/)${regexStr}$`).test(normalized);
  }

  private searchCode(
    pattern: string,
    directory: string,
    filePattern?: string,
  ): string {
    const resolved = this.resolve(directory);
    const files = this.walk(resolved);
    const filtered = filePattern
      ? files.filter((f) => this.matchGlob(f, filePattern))
      : files;
    const regex = new RegExp(pattern, 'i');
    const results: string[] = [];

    for (const file of filtered) {
      try {
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (regex.test(lines[i])) {
            const rel = path
              .relative(this.projectRoot, file)
              .replace(/\\/g, '/');
            results.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
          }
        }
      } catch {
        // skip unreadable files
      }
    }

    return results.length > 0
      ? results.slice(0, 200).join('\n')
      : '(no matches found)';
  }

  // Security note: this executes arbitrary shell commands as instructed by the AI model.
  // The agent is a local dev tool intended to run against your own project only.
  // Do not expose it as a service or point it at untrusted projects.
  private runCommand(command: string, cwd?: string): string {
    const workDir = cwd ? this.resolve(cwd) : this.projectRoot;
    try {
      const output = execSync(command, {
        cwd: workDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 120_000,
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/sh',
      });
      return output || '(command produced no output)';
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string; message?: string };
      // Many tools (npm outdated, jest) exit non-zero but still produce useful output
      return (
        [e.stdout, e.stderr].filter(Boolean).join('\n') ||
        e.message ||
        'Command failed'
      );
    }
  }

  private writeFile(filePath: string, content: string, reason: string): string {
    const resolved = this.resolve(filePath);
    this._proposedChanges.push({
      type: 'write',
      path: resolved,
      reason,
      newString: content,
    });

    if (this.apply) {
      fs.mkdirSync(path.dirname(resolved), { recursive: true });
      fs.writeFileSync(resolved, content, 'utf8');
      return `Written: ${filePath}`;
    }
    return `[DRY RUN] Would write ${filePath} — ${reason}`;
  }

  private editFile(
    filePath: string,
    oldString: string,
    newString: string,
    reason: string,
  ): string {
    const resolved = this.resolve(filePath);
    if (!fs.existsSync(resolved))
      return `Edit failed: file not found — ${filePath}`;

    const current = fs.readFileSync(resolved, 'utf8');
    if (!current.includes(oldString)) {
      return `Edit failed: exact string not found in ${filePath}`;
    }

    this._proposedChanges.push({
      type: 'edit',
      path: resolved,
      reason,
      oldString,
      newString,
    });

    if (this.apply) {
      fs.writeFileSync(resolved, current.replace(oldString, newString), 'utf8');
      return `Edited: ${filePath}`;
    }
    return `[DRY RUN] Would edit ${filePath} — ${reason}`;
  }
}
