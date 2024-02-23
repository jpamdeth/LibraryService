import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

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
