import Anthropic from '@anthropic-ai/sdk';
import { toolDefinitions } from '../tools/definitions';
import { ToolExecutor } from '../tools/executor';

const MODEL = 'claude-opus-4-6';
const MAX_TOKENS = 8192;
const MAX_ITERATIONS = 30;

export class BaseAgent {
  private client: Anthropic;

  constructor(
    private readonly executor: ToolExecutor,
    apiKey: string,
    private readonly verbose = false,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async run(systemPrompt: string, userPrompt: string): Promise<string> {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: userPrompt },
    ];
    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      iterations++;

      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        tools: toolDefinitions,
        messages,
      });

      messages.push({ role: 'assistant', content: response.content });

      if (response.stop_reason === 'end_turn') {
        return response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');
      }

      if (response.stop_reason === 'tool_use') {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type !== 'tool_use') continue;

          if (this.verbose) {
            process.stdout.write(
              `  [tool] ${block.name}(${JSON.stringify(block.input).slice(0, 80)})\n`,
            );
          }

          const result = await this.executor.execute(
            block.name,
            block.input as Record<string, unknown>,
          );

          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result,
          });
        }

        messages.push({ role: 'user', content: toolResults });
        continue;
      }

      // max_tokens or other stop — return whatever text we have
      return response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');
    }

    return '(agent reached iteration limit without finishing)';
  }
}
