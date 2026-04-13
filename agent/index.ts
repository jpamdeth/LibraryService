import * as path from 'path';
import * as process from 'process';
import { runOrchestrator } from './orchestrator';
import { RunOptions } from './types';

function parseArgs(argv: string[]): RunOptions {
  const args = argv.slice(2);

  const apply = args.includes('--apply');

  const agentsFlag = args.find((a) => a.startsWith('--agents='));
  const agents = agentsFlag
    ? agentsFlag
        .replace('--agents=', '')
        .split(',')
        .map((s) => s.trim())
    : [];

  const rootFlag = args.find((a) => a.startsWith('--project-root='));
  const projectRoot = rootFlag
    ? path.resolve(rootFlag.replace('--project-root=', ''))
    : path.resolve(process.cwd());

  const apiKey = process.env.ANTHROPIC_API_KEY ?? '';
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Set it with: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }

  return { projectRoot, apply, apiKey, agents };
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  await runOrchestrator(opts);
}

main().catch((err) => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
