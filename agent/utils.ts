import { AgentFinding } from './types';

interface ParsedFindings {
  findings: AgentFinding[];
  appliedChanges: string[];
  summary: string;
}

/**
 * Extracts the structured JSON findings block from the agent's raw text response.
 * Falls back to a single info finding containing the raw text if no JSON block is found.
 */
export function parseFindings(rawOutput: string): ParsedFindings {
  const match = rawOutput.match(/```json\s*([\s\S]*?)```/);
  if (!match) {
    return {
      findings: [
        {
          severity: 'info',
          title: 'Raw output',
          description: rawOutput.slice(0, 500),
        },
      ],
      appliedChanges: [],
      summary: rawOutput.slice(0, 200),
    };
  }

  try {
    const parsed = JSON.parse(match[1]);
    return {
      findings: parsed.findings ?? [],
      appliedChanges: parsed.appliedChanges ?? [],
      summary: parsed.summary ?? '',
    };
  } catch {
    return {
      findings: [
        {
          severity: 'info',
          title: 'Parse error',
          description: `Could not parse agent JSON: ${match[1].slice(0, 200)}`,
        },
      ],
      appliedChanges: [],
      summary: '',
    };
  }
}

const SEVERITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
  info: 3,
};
const SEVERITY_LABELS: Record<string, string> = {
  high: '🔴 HIGH',
  medium: '🟡 MED ',
  low: '🟢 LOW ',
  info: '⚪ INFO',
};

export function formatReport(
  agentName: string,
  findings: AgentFinding[],
  summary: string,
): string {
  const sorted = [...findings].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
  );

  const lines: string[] = [];
  lines.push(`\n${'─'.repeat(70)}`);
  lines.push(`  ${agentName.toUpperCase()}`);
  lines.push(`${'─'.repeat(70)}`);

  if (sorted.length === 0) {
    lines.push('  No findings.');
  } else {
    for (const f of sorted) {
      const label = SEVERITY_LABELS[f.severity] ?? f.severity;
      lines.push(`\n  ${label}  ${f.title}`);
      lines.push(`         ${f.description}`);
      if (f.file) lines.push(`         File: ${f.file}`);
      if (f.suggestedFix) lines.push(`         Fix:  ${f.suggestedFix}`);
    }
  }

  if (summary) {
    lines.push(`\n  Summary: ${summary}`);
  }

  return lines.join('\n');
}
