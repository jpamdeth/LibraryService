import Anthropic from '@anthropic-ai/sdk';

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'read_file',
    description: 'Read the full contents of a file.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Path to the file, relative to the project root',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_files',
    description:
      'List files under a directory, optionally filtered by a glob pattern. Skips node_modules, dist, coverage, and .git.',
    input_schema: {
      type: 'object' as const,
      properties: {
        directory: {
          type: 'string',
          description: 'Directory to list, relative to project root',
        },
        pattern: {
          type: 'string',
          description:
            'Optional glob-style filter, e.g. "**/*.ts" or "*.spec.ts"',
        },
      },
      required: ['directory'],
    },
  },
  {
    name: 'search_code',
    description:
      'Search file contents using a regex pattern. Returns matching lines with file and line number.',
    input_schema: {
      type: 'object' as const,
      properties: {
        pattern: { type: 'string', description: 'Regex pattern to search for' },
        directory: {
          type: 'string',
          description: 'Directory to search in, relative to project root',
        },
        file_pattern: {
          type: 'string',
          description:
            'Optional glob to restrict which files are searched, e.g. "**/*.ts"',
        },
      },
      required: ['pattern', 'directory'],
    },
  },
  {
    name: 'run_command',
    description:
      'Run a shell command and return stdout + stderr. Use for npm outdated, jest --coverage, eslint, etc. Commands are run from the project root unless cwd is specified.',
    input_schema: {
      type: 'object' as const,
      properties: {
        command: { type: 'string', description: 'Shell command to run' },
        cwd: {
          type: 'string',
          description:
            'Optional working directory override, relative to project root',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'write_file',
    description:
      'Write (or overwrite) a file. In dry-run mode the change is recorded but not written to disk.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'File path relative to project root',
        },
        content: { type: 'string', description: 'Full file content to write' },
        reason: {
          type: 'string',
          description: 'Why this change is being made',
        },
      },
      required: ['path', 'content', 'reason'],
    },
  },
  {
    name: 'edit_file',
    description:
      'Replace an exact string in a file. In dry-run mode the change is recorded but not applied to disk.',
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'File path relative to project root',
        },
        old_string: {
          type: 'string',
          description: 'The exact string to replace',
        },
        new_string: { type: 'string', description: 'The replacement string' },
        reason: {
          type: 'string',
          description: 'Why this change is being made',
        },
      },
      required: ['path', 'old_string', 'new_string', 'reason'],
    },
  },
];
