export interface AgentFinding {
  severity: 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  file?: string;
  suggestedFix?: string;
}

export interface AgentReport {
  agentName: string;
  findings: AgentFinding[];
  appliedChanges: string[];
  summary: string;
}

export interface RunOptions {
  projectRoot: string;
  apply: boolean;
  apiKey: string;
  agents: string[];
}
