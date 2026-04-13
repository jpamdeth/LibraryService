import { AgentReport, RunOptions } from '../types';
import { ToolExecutor } from '../tools/executor';
import { BaseAgent } from './base';
import { parseFindings } from '../utils';

const SYSTEM_PROMPT = `You are a software architecture expert specialising in NestJS and clean architecture.
Your job is to analyse module boundaries, separation of concerns, and opportunities for simplification.

Steps to follow:
1. List and read all module files (*.module.ts) to understand the dependency graph.
2. Read all controllers (*.controller.ts) — check whether they contain any business logic that
   belongs in a service, or any database concerns that bypass the service layer.
3. Read all services (*.service.ts) — check whether they are doing too many unrelated things
   (Single Responsibility Principle), or directly coupled to infrastructure they shouldn't know about.
4. Look for duplicated logic across services that could be extracted into a shared utility or helper.
5. Review DTOs (*.dto.ts) and models — are validation constraints consistent? Are types reused
   across DTOs where they could be inherited or composed?
6. Check for any circular dependencies or tight coupling between modules.
7. Identify any missing abstractions: e.g., logic that is inlined where an interface/strategy
   pattern would make it easier to test or swap.

Focus on the "why it matters" — explain the real maintenance or testability impact of each finding.

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

export async function runArchitectureAgent(
  opts: RunOptions,
): Promise<AgentReport> {
  const executor = new ToolExecutor(opts.projectRoot, opts.apply);
  const agent = new BaseAgent(executor, opts.apiKey, true);

  const userPrompt = `Analyse the architecture of the NestJS project at: ${opts.projectRoot}
Apply mode: ${opts.apply ? 'YES — you may refactor straightforward issues' : 'NO — identify issues only'}

The project uses NestJS, Prisma ORM with MariaDB, and OpenAI for a suggestions feature.
Focus on separation of concerns, single responsibility, and reuse opportunities.`;

  console.log('  Running architecture analysis...');
  const rawOutput = await agent.run(SYSTEM_PROMPT, userPrompt);

  return {
    agentName: 'Architecture Agent',
    ...parseFindings(rawOutput),
  };
}
