import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthorDto, BookDto, GenreDto } from './library.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly service: LibraryService) {}

  @Get('authors')
  @ApiOperation({ summary: 'get all authors' })
  async getAuthors() {
    return this.service.getAuthors();
  }

  @Get('authors/:authorId')
  @ApiOperation({ summary: 'get an author' })
  async getAuthor(@Param('authorId') authorId: string) {
    return this.service.getAuthor(authorId);
  }

  @Post('authors')
  @ApiOperation({ summary: 'save an author' })
  async saveAuthor(@Body() author: AuthorDto) {
    return this.service.createAuthor(author);
  }

  @Put('authors/:authorId')
  @ApiOperation({ summary: 'update an author' })
  async updateAuthor(@Body() author: AuthorDto, @Param('authorId') authorId: string) {
    return this.service.updateAuthor(author, authorId);
  }

  @Delete('authors/:authorId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete an author' })
  async deleteAuthor(@Param('authorId') authorId: string) {
    return this.service.deleteAuthor(authorId);
  }

  @Get('genres/:genreId')
  @ApiOperation({ summary: 'get a genre' })
  async getGenre(@Param('genreId') genreId: string) {
    return this.service.getGenre(genreId);
  }

  @Post('genres')
  @ApiOperation({ summary: 'save a genre' })
  async saveGenre(@Body() genre: GenreDto) {
    return this.service.createGenre(genre);
  }

  @Put('genres/:genreId')
  @ApiOperation({ summary: 'update a genre' })
  async updateGenre(@Body() genre: GenreDto, @Param('genreId') genreId: string) {
    return this.service.updateGenre(genre, genreId);
  }

  @Delete('genres/:genreId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete a genre' })
  async deleteGenre(@Param('genreId') genreId: string) {
    return this.service.deleteGenre(genreId);
  }

  @Get('books/:bookId')
  @ApiOperation({ summary: 'get a book' })
  async getBook(@Param('bookId') bookId: string) {
    return this.service.getBook(bookId);
  }

  @Post('books')
  @ApiOperation({ summary: 'save a book' })
  async saveBook(@Body() book: BookDto) {
    return this.service.createBook(book);
  }

  @Put('books/:bookId')
  @ApiOperation({ summary: 'update a book' })
  async updateBook(@Body() book: BookDto, @Param('bookId') bookId: string) {
    return this.service.updateBook(book, bookId);
  }

  @Delete('books/:bookId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete a book' })
  async deleteBook(@Param('bookId') bookId: string) {
    return this.service.deleteBook(bookId);
  }

  @Get('suggestions/:authorId/:apiKey')
  @ApiOperation({ summary: 'get book suggestions for an author' })
  async getSuggestions(@Param('authorId') authorId: string, @Param('apiKey') apiKey: string) {
    return this.service.suggestBooks(authorId, apiKey);
  }

  @Get('suggestions/:firstName/:lastName/:apiKey')
  @ApiOperation({ summary: 'get book suggestions for an author' })
  async getSuggestionsByName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
    @Param('apiKey') apiKey: string,
  ) {
    return this.service.createAndSuggestBooks(firstName, lastName, apiKey);
  }
}
