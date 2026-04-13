import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

const GPT_MODEL = 'gpt-4o';
const MAX_TOKENS = 1000;
const TEMPERATURE = 0.7;

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openaiInstances = new Map<string, OpenAI>();

  async getSuggestions(
    messages: ChatCompletionMessageParam[],
    apiKey: string,
  ): Promise<string> {
    let openai = this.openaiInstances.get(apiKey);

    if (!openai) {
      openai = new OpenAI({ apiKey });
      this.openaiInstances.set(apiKey, openai);
    }

    try {
      const completion: ChatCompletion = await openai.chat.completions.create({
        messages,
        model: GPT_MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
      });

      this.logger.debug(`OpenAI usage: ${JSON.stringify(completion.usage)}`);
      return (
        completion.choices[0]?.message?.content || 'No suggestions available'
      );
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw new Error('Failed to get suggestions from OpenAI');
    }
  }
}
