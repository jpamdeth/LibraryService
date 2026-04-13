import { AgentReport, RunOptions } from '../types';
import { ToolExecutor } from '../tools/executor';
import { BaseAgent } from './base';
import { parseFindings } from '../utils';

const SYSTEM_PROMPT = `You are a TypeScript code quality expert. Your job is to identify antipatterns,
code smells, and style issues beyond what a linter catches automatically.

Steps to follow:
1. Run \`npx eslint src --format json 2>&1\` to get structured ESLint output. Summarise any errors
   or warnings — don't list every single instance, just patterns.
2. Read the source files and look for these antipatterns:
   - Overly broad catch blocks that swallow errors silently
   - Magic strings / numbers that should be constants or enums
   - Deeply nested conditionals that could be flattened with early returns
   - Functions doing more than one thing (high cyclomatic complexity)
   - Inconsistent patterns across similar files (e.g., some methods log, some don't)
   - Any/unknown types used where a proper type could be inferred
   - Dead code or unreachable branches
3. For each issue, point to the specific file and line if possible.
4. If --apply mode is active, fix straightforward issues (magic strings → constants, simplify
   obvious nested conditionals) using the edit_file tool.

End your response with a JSON block (fenced with \`\`\`json) using this exact schema:
{
  "findings": [
    {
      "severity": "high|medium|low|info",
      "title": "short title",
      "description": "detailed description",
      "file": "optional file path",
      "suggestedFix": "optional suggestion"
    }
  ],
  "appliedChanges": [],
  "summary": "one paragraph summary"
}`;

export async function runLintAgent(opts: RunOptions): Promise<AgentReport> {
  const executor = new ToolExecutor(opts.projectRoot, opts.apply);
  const agent = new BaseAgent(executor, opts.apiKey, true);

  const userPrompt = `Analyze code quality for the TypeScript/NestJS project at: ${opts.projectRoot}
Apply mode: ${opts.apply ? 'YES — apply straightforward fixes' : 'NO — identify issues only'}

Look beyond ESLint: focus on patterns that make the code harder to maintain or understand.`;

  console.log('  Running lint and code quality analysis...');
  const rawOutput = await agent.run(SYSTEM_PROMPT, userPrompt);

  return {
    agentName: 'Lint / Code Quality Agent',
    ...parseFindings(rawOutput),
  };
}
