import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
/**
 * Service class for interacting with the OpenAI API.
 */
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

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
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }

    const completion: ChatCompletion =
      await this.openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4-turbo-preview',
      });

    this.logger.debug(completion);
    return completion.choices[0].message.content;
  }
}
