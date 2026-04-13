import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from '../openai/openai.service';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Author, Book, Genre } from './library.models';
import { AuthorDto, BookDto, GenreDto } from './library.dto';

/**
 * Service class for managing library operations.
 */
@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
  ) {}

  /**
   * Retrieves all authors from the library.
   * @returns A promise that resolves to an array of authors.
   */
  async getAuthors(): Promise<Author[]> {
    this.logger.debug('Getting all authors');
    return this.prisma.author.findMany();
  }

  /**
   * Retrieves all books from the library.
   * @returns A promise that resolves to an array of books.
   */
  async getBooks(): Promise<Book[]> {
    this.logger.debug('Getting all books');
    return this.prisma.book.findMany();
  }

  /**
   * Retrieves all genres from the library.
   * @returns A promise that resolves to an array of genres.
   */
  async getGenres(): Promise<Genre[]> {
    this.logger.debug('Getting all genres');
    return this.prisma.genre.findMany();
  }

  /**
   * Creates a new author in the library.
   * @param author - The author data to be created.
   * @returns A promise that resolves to the created author.
   */
  async createAuthor(author: AuthorDto): Promise<Author> {
    this.logger.debug(
      'Saving author ' + author.firstName + ' ' + author.lastName,
    );
    return this.prisma.author.create({ data: author });
  }

  /**
   * Updates an existing author in the library.
   * @param author - The updated author data.
   * @param authorId - The ID of the author to be updated.
   * @returns A promise that resolves to the updated author.
   */
  async updateAuthor(author: AuthorDto, authorId: string): Promise<Author> {
    this.logger.debug('Updating author ' + authorId);
    const { authorId: _id, ...data } = author;
    return this.prisma.author.update({
      where: { id: authorId },
      data,
    });
  }

  /**
   * Creates a new genre in the library.
   * @param genre - The genre data to be created.
   * @returns A promise that resolves to the created genre.
   */
  async createGenre(genre: GenreDto): Promise<Genre> {
    this.logger.debug('Saving genre ' + genre.genre);
    return this.prisma.genre.create({ data: genre });
  }

  /**
   * Updates an existing genre in the library.
   * @param genre - The updated genre data.
   * @param genreId - The ID of the genre to be updated.
   * @returns A promise that resolves to the updated genre.
   */
  async updateGenre(genre: GenreDto, genreId: string): Promise<Genre> {
    this.logger.debug('Updating genre ' + genreId);
    const { genreId: _id, ...data } = genre;
    return this.prisma.genre.update({
      where: { id: genreId },
      data,
    });
  }

  /**
   * Creates a new book in the library.
   * @param book - The book data to be created.
   * @returns A promise that resolves to the created book.
   */
  async createBook(book: BookDto): Promise<Book> {
    this.logger.debug('Saving book ' + book.title);
    return this.prisma.book.create({ data: book });
  }

  /**
   * Updates an existing book in the library.
   * @param book - The updated book data.
   * @param bookId - The ID of the book to be updated.
   * @returns A promise that resolves to the updated book.
   */
  async updateBook(book: BookDto, bookId: string): Promise<Book> {
    this.logger.debug('Updating book ' + bookId);
    const { bookId: _id, ...data } = book;
    return this.prisma.book.update({
      where: { id: bookId },
      data,
    });
  }

  /**
   * Retrieves an author from the library by ID.
   * @param authorId - The ID of the author to retrieve.
   * @returns A promise that resolves to the retrieved author.
   */
  async getAuthor(authorId: string): Promise<Author> {
    this.logger.debug('Getting author ' + authorId);
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
      include: {
        books: {
          include: {
            genre: true,
          },
        },
      },
    });
    if (!author) throw new NotFoundException(`Author not found: ${authorId}`);
    return author;
  }

  /**
   * Retrieves a genre from the library by ID.
   * @param genreId - The ID of the genre to retrieve.
   * @returns A promise that resolves to the retrieved genre.
   */
  async getGenre(genreId: string): Promise<Genre> {
    this.logger.debug('Getting genre ' + genreId);
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
    });
    if (!genre) throw new NotFoundException(`Genre not found: ${genreId}`);
    return genre;
  }

  /**
   * Retrieves a book from the library by ID.
   * @param bookId - The ID of the book to retrieve.
   * @returns A promise that resolves to the retrieved book.
   */
  async getBook(bookId: string): Promise<Book> {
    this.logger.debug('Getting book ' + bookId);
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) throw new NotFoundException(`Book not found: ${bookId}`);
    return book;
  }

  /**
   * Deletes an author from the library by ID.
   * @param authorId - The ID of the author to delete.
   * @returns A promise that resolves to the deleted author.
   */
  async deleteAuthor(authorId: string): Promise<Author> {
    this.logger.debug('Deleting author ' + authorId);
    return this.prisma.author.delete({
      where: { id: authorId },
    });
  }

  /**
   * Deletes a genre from the library by ID.
   * @param genreId - The ID of the genre to delete.
   * @returns A promise that resolves to the deleted genre.
   */
  async deleteGenre(genreId: string): Promise<Genre> {
    this.logger.debug('Deleting genre ' + genreId);
    return this.prisma.genre.delete({
      where: { id: genreId },
    });
  }

  /**
   * Deletes a book from the library by ID.
   * @param bookId - The ID of the book to delete.
   * @returns A promise that resolves to the deleted book.
   */
  async deleteBook(bookId: string): Promise<Book> {
    this.logger.debug('Deleting book ' + bookId);
    return this.prisma.book.delete({
      where: { id: bookId },
    });
  }

  /**
   * Creates an author and suggests books for the author.
   * @param firstName - The first name of the author.
   * @param lastName - The last name of the author.
   * @param apiKey - The API key for accessing OpenAI APIs.
   * @returns A promise that resolves to the suggested books in JSON format.
   */
  async createAndSuggestBooks(
    firstName: string,
    lastName: string,
    apiKey: string,
  ): Promise<string> {
    const author = await this.createAuthor({ firstName, lastName });
    return this.suggestBooks(author.id, apiKey);
  }

  /**
   * Suggests books for an author.
   * @param authorId - The ID of the author.
   * @param apiKey - The API key for accessing OpenAI APIs.
   * @returns A promise that resolves to the suggested books in JSON format.
   */
  async suggestBooks(authorId: string, apiKey: string): Promise<string> {
    this.logger.debug('Suggesting books for author ' + authorId);

    const author: Author = await this.prisma.author.findUnique({
      where: { id: authorId },
      include: { books: true },
    });

    if (!author) {
      throw new NotFoundException(`Author not found: ${authorId}`);
    }

    return this.openai.getSuggestions(
      this.buildSuggestionPrompt(author),
      apiKey,
    );
  }

  private buildSuggestionPrompt(author: Author): ChatCompletionMessageParam[] {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: `If I have any books from author ${author.firstName} ${author.lastName} \
they are listed following.  Can you suggest some other titles?. \
Please use JSON format for the response.  This is the JSON format:    \
title: string; \
description?: string; \
authorId: ${author.id}; \
published: Date; \
series?: string; \
seriesNumber?: number; \
edition?: string;`,
      },
    ];

    for (const book of author.books ?? []) {
      messages.push({ role: 'user', content: book.title });
    }

    return messages;
  }
}
