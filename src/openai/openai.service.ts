import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
/**
 * Service class for interacting with the OpenAI API.
 */
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openaiInstances = new Map<string, OpenAI>();

  /**
   * Retrieves suggestions from the OpenAI API.
   * @param messages - An array of chat completion messages.
   * @param apiKey - The API key for accessing the OpenAI API.
   * @returns A promise that resolves to a string representing the suggested completion.
   */
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
        messages: messages,
        model: 'gpt-5.2',
        max_tokens: 1000,
        temperature: 0.7,
      });

      this.logger.debug(completion);
      return (
        completion.choices[0]?.message?.content || 'No suggestions available'
      );
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw new Error('Failed to get suggestions from OpenAI');
    }
  }
}
