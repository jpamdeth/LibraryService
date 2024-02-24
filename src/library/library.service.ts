import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from '../openai/openai.service';
import { ChatCompletionMessageParam } from 'openai/resources';
import { BadInputException } from './library.exception';
import { Author, Book, Genre } from './library.models';
import { AuthorDto, BookDto, GenreDto } from './library.dto';

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
  ) {}

  async getAuthors(): Promise<Author[]> {
    this.logger.debug('Getting all authors');
    return this.prisma.author.findMany();
  }

  async createAuthor(author: AuthorDto): Promise<Author> {
    this.logger.debug(
      'Saving author ' + author.firstName + ' ' + author.lastName,
    );
    return this.prisma.author.create({ data: author });
  }

  async updateAuthor(author: AuthorDto, authorId: string): Promise<Author> {
    this.logger.debug('Updating author ' + authorId);
    return this.prisma.author.update({
      where: { id: authorId },
      data: author,
    });
  }

  async createGenre(genre: GenreDto): Promise<Genre> {
    this.logger.debug('Saving genre ' + genre.genre);
    return this.prisma.genre.create({ data: genre });
  }

  async updateGenre(genre: GenreDto, genreId: string): Promise<Genre> {
    this.logger.debug('Updating genre ' + genreId);
    return this.prisma.genre.update({
      where: { id: genreId },
      data: genre,
    });
  }

  async createBook(book: BookDto): Promise<Book> {
    this.logger.debug('Saving book ' + book.title);
    if (book.published) {
      book.published = new Date(book.published);
      if (book.published.toString() === 'Invalid Date') {
        throw new BadInputException('Invalid date format for published date');
      }
    }
    return this.prisma.book.create({ data: book });
  }

  async updateBook(book: BookDto, bookId: string): Promise<Book> {
    this.logger.debug('Updating book ' + bookId);
    if (book.published) {
      book.published = new Date(book.published);
      if (book.published.toString() === 'Invalid Date') {
        throw new BadInputException('Invalid date format for published date');
      }
    }
    return this.prisma.book.update({
      where: { id: bookId },
      data: book,
    });
  }

  async getAuthor(authorId: string): Promise<Author> {
    this.logger.debug('Getting author ' + authorId);
    return this.prisma.author.findUnique({
      where: { id: authorId },
      include: {
        books: {
          include: {
            genre: true,
          },
        },
      },
    });
  }

  async getGenre(genreId: string): Promise<Genre> {
    this.logger.debug('Getting genre ' + genreId);
    return this.prisma.genre.findUnique({
      where: { id: genreId },
    });
  }

  async getBook(bookId: string): Promise<Book> {
    this.logger.debug('Getting book ' + bookId);
    return this.prisma.book.findUnique({
      where: { id: bookId },
    });
  }

  async deleteAuthor(authorId: string): Promise<Author> {
    this.logger.debug('Deleting author ' + authorId);
    return this.prisma.author.delete({
      where: { id: authorId },
    });
  }

  async deleteGenre(genreId: string): Promise<Genre> {
    this.logger.debug('Deleting genre ' + genreId);
    return this.prisma.genre.delete({
      where: { id: genreId },
    });
  }

  async deleteBook(bookId: string): Promise<Book> {
    this.logger.debug('Deleting book ' + bookId);
    return this.prisma.book.delete({
      where: { id: bookId },
    });
  }

  async createAndSuggestBooks(
    firstName: string,
    lastName: string,
    apiKey: string,
  ): Promise<string> {
    const author = await this.createAuthor({ firstName, lastName });
    return this.suggestBooks(author.id, apiKey);
  }

  async suggestBooks(authorId: string, apiKey: string): Promise<string> {
    this.logger.debug('Suggesting books for author ' + authorId);

    const author: Author = await this.prisma.author.findUnique({
      where: { id: authorId },
      include: { books: true },
    });

    const messages: ChatCompletionMessageParam[] = [];
    messages.push({
      role: 'user',
      content: `If I have any books from author ${author.firstName} ${author.lastName} 
      they are listed following.  Can you suggest some other titles?. Please use JSON format for the response.  
      This is the JSON format:    
      title: string;
      description?: string;
      authorId: ${authorId};
      published: Date;
      series?: string;
      seriesNumber?: number;
      edition?: string;`,
    });

    if (author.books) {
      for (const book of author.books) {
        messages.push({
          role: 'user',
          content: book.title,
        });
      }
    }

    return this.openai.getSuggestions(messages, apiKey);
  }
}
