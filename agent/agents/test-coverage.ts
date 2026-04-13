import { AgentReport, RunOptions } from '../types';
import { ToolExecutor } from '../tools/executor';
import { BaseAgent } from './base';
import { parseFindings } from '../utils';

const SYSTEM_PROMPT = `You are a test coverage analysis expert for TypeScript/NestJS projects.
Your job is to find gaps in test coverage and produce actionable findings.

Steps to follow:
1. List all source files (exclude *.spec.ts, *.module.ts, main.ts, dto files).
2. List all spec files to see what is already tested.
3. For each source file without a corresponding spec, flag it.
4. For source files that DO have specs, read both files and check:
   - Are all public methods tested?
   - Are error/edge-case paths tested (not-found, validation failures, etc.)?
   - Are mocks realistic or do they paper over important logic?
5. Run \`npx jest --coverage --coverageReporters=text-summary 2>&1\` to get line coverage numbers.
   Use the summary to prioritise which gaps matter most.
6. When you identify a missing test, describe exactly what scenario to test and why it matters.

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

export async function runTestCoverageAgent(
  opts: RunOptions,
): Promise<AgentReport> {
  const executor = new ToolExecutor(opts.projectRoot, opts.apply);
  const agent = new BaseAgent(executor, opts.apiKey, true);

  const userPrompt = `Analyze test coverage for the NestJS project at: ${opts.projectRoot}
Apply mode: ${opts.apply ? 'YES — you may write new spec files or add test cases' : 'NO — identify gaps only'}

Focus on meaningful coverage: business logic, error paths, edge cases.`;

  console.log('  Running test coverage analysis...');
  const rawOutput = await agent.run(SYSTEM_PROMPT, userPrompt);

  return {
    agentName: 'Test Coverage Agent',
    ...parseFindings(rawOutput),
  };
}
