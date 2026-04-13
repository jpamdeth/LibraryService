import { AgentReport, RunOptions } from './types';
import { formatReport } from './utils';
import { runDependencyAgent } from './agents/dependency';
import { runTestCoverageAgent } from './agents/test-coverage';
import { runLintAgent } from './agents/lint';
import { runArchitectureAgent } from './agents/architecture';

type AgentRunner = (opts: RunOptions) => Promise<AgentReport>;

const ALL_AGENTS: Record<string, AgentRunner> = {
  dep: runDependencyAgent,
  test: runTestCoverageAgent,
  lint: runLintAgent,
  arch: runArchitectureAgent,
};

export async function runOrchestrator(opts: RunOptions): Promise<void> {
  const selected =
    opts.agents.length > 0 ? opts.agents : Object.keys(ALL_AGENTS);
  const unknown = selected.filter((a) => !ALL_AGENTS[a]);
  if (unknown.length > 0) {
    console.error(
      `Unknown agents: ${unknown.join(', ')}. Valid: ${Object.keys(ALL_AGENTS).join(', ')}`,
    );
    process.exit(1);
  }

  console.log(
    '\n╔══════════════════════════════════════════════════════════════════════╗',
  );
  console.log(
    '║              LibraryService — Code Improvement Agent                ║',
  );
  console.log(
    '╚══════════════════════════════════════════════════════════════════════╝',
  );
  console.log(`  Project : ${opts.projectRoot}`);
  console.log(
    `  Mode    : ${opts.apply ? 'APPLY (changes will be written)' : 'DRY RUN (no files changed)'}`,
  );
  console.log(`  Agents  : ${selected.join(', ')}\n`);

  const reports: AgentReport[] = [];

  for (const agentKey of selected) {
    console.log(`\n▶ ${agentKey.toUpperCase()} agent`);
    try {
      const report = await ALL_AGENTS[agentKey](opts);
      reports.push(report);
      console.log(
        formatReport(report.agentName, report.findings, report.summary),
      );

      if (report.appliedChanges.length > 0) {
        console.log(`\n  Applied changes:`);
        for (const change of report.appliedChanges) {
          console.log(`    • ${change}`);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Agent failed: ${message}`);
      reports.push({
        agentName: agentKey,
        findings: [
          { severity: 'high', title: 'Agent error', description: message },
        ],
        appliedChanges: [],
        summary: `Agent failed: ${message}`,
      });
    }
  }

  printFinalSummary(reports, opts.apply);
}

function printFinalSummary(reports: AgentReport[], applied: boolean): void {
  console.log(
    '\n\n══════════════════════════════════════════════════════════════════════',
  );
  console.log('  FINAL SUMMARY');
  console.log(
    '══════════════════════════════════════════════════════════════════════',
  );

  const counts = { high: 0, medium: 0, low: 0, info: 0 };
  for (const report of reports) {
    for (const f of report.findings) {
      counts[f.severity] = (counts[f.severity] ?? 0) + 1;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`  Total findings: ${total}`);
  if (counts.high) console.log(`    🔴 High   : ${counts.high}`);
  if (counts.medium) console.log(`    🟡 Medium : ${counts.medium}`);
  if (counts.low) console.log(`    🟢 Low    : ${counts.low}`);
  if (counts.info) console.log(`    ⚪ Info   : ${counts.info}`);

  const totalChanges = reports.reduce((n, r) => n + r.appliedChanges.length, 0);
  if (applied && totalChanges > 0) {
    console.log(`\n  Applied ${totalChanges} change(s) to disk.`);
  } else if (!applied && total > 0) {
    console.log('\n  Re-run with --apply to write safe fixes to disk.');
  }

  console.log('');
}
