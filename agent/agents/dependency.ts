import { AgentReport, RunOptions } from '../types';
import { ToolExecutor } from '../tools/executor';
import { BaseAgent } from './base';
import { parseFindings } from '../utils';

const SYSTEM_PROMPT = `You are a Node.js dependency analysis expert. Your job is to audit a project's
dependencies for outdated packages, security vulnerabilities, and upgrade opportunities.

Steps to follow:
1. Read package.json to understand what is installed.
2. Run \`npm outdated --json\` to get the full list of outdated packages. Note: this command exits
   non-zero when packages are outdated — the output is still valid JSON.
3. Run \`npm audit --json\` to find known CVEs and security advisories.
4. Classify each outdated package:
   - patch update (e.g. 1.0.1 → 1.0.2): safe, auto-apply
   - minor update (e.g. 1.0.0 → 1.1.0): usually safe, apply with low severity
   - major update (e.g. 1.x → 2.x): breaking changes likely, flag as medium
5. For security vulnerabilities, flag as high if critical/high severity, medium otherwise.
6. If --apply mode is active (write_file / edit_file tools will persist changes), update package.json
   for safe patch/minor bumps and explain each change.

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

export async function runDependencyAgent(
  opts: RunOptions,
): Promise<AgentReport> {
  const executor = new ToolExecutor(opts.projectRoot, opts.apply);
  const agent = new BaseAgent(executor, opts.apiKey, true);

  const userPrompt = `Analyze the dependencies of the project at: ${opts.projectRoot}
Apply mode: ${opts.apply ? 'YES — write safe updates to disk' : 'NO — dry run, propose only'}

Please check for outdated packages and security vulnerabilities.`;

  console.log('  Running dependency analysis...');
  const rawOutput = await agent.run(SYSTEM_PROMPT, userPrompt);

  return {
    agentName: 'Dependency Agent',
    ...parseFindings(rawOutput),
  };
}
