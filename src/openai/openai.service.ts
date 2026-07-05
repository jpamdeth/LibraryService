import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { createHash } from 'crypto';

const GPT_MODEL = 'gpt-4o';
const MAX_TOKENS = 1000;
const TEMPERATURE = 0.7;

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openaiInstances = new Map<string, OpenAI>();

  constructor(private readonly configService: ConfigService) {}

  async getSuggestions(
    messages: ChatCompletionMessageParam[],
    apiKey: string,
  ): Promise<string> {
    const cacheKey = this.hashApiKey(apiKey);
    let openai = this.openaiInstances.get(cacheKey);

    if (!openai) {
      openai = new OpenAI({ apiKey });
      this.openaiInstances.set(cacheKey, openai);
    }

    try {
      const completion: ChatCompletion = await openai.chat.completions.create({
        messages,
        model: this.configService.get<string>('OPENAI_MODEL', GPT_MODEL),
        max_tokens: Number(
          this.configService.get<string | number>(
            'OPENAI_MAX_TOKENS',
            MAX_TOKENS,
          ),
        ),
        temperature: Number(
          this.configService.get<string | number>(
            'OPENAI_TEMPERATURE',
            TEMPERATURE,
          ),
        ),
      });

      this.logger.debug(`OpenAI usage: ${JSON.stringify(completion.usage)}`);
      return (
        completion.choices[0]?.message?.content || 'No suggestions available'
      );
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw new Error('Failed to get suggestions from OpenAI', {
        cause: error,
      });
    }
  }

  private hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
  }
}
