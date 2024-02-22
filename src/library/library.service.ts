import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from '../openai/openai.service';
import { ChatCompletionMessageParam } from 'openai/resources';
import { BadInputException } from './library.exception';
import { Author } from './library.models';

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
  ) {}

  async suggestBeats(authorId: string): Promise<string> {
    this.logger.debug('Suggesting books for author ' + authorId);

    const author: Author = await this.prisma.author.findUnique({
      where: { id: authorId },
      include: { books: true },
    });

    const messages: ChatCompletionMessageParam[] = [];
    messages.push({
      role: 'user',
      content: `.`,
    });

    for (const book of author.books) {
      messages.push({
        role: 'user',
        content: book.title,
      });
    }

    return this.openai.getSuggestions(messages);
  }
}
