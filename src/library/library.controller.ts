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

@Controller('beatsheet')
export class LibraryController {
  constructor(private readonly service: LibraryService) {}

  @Get('author/:authorId')
  @ApiOperation({ summary: 'get an author' })
  async getAuthor(@Param('authorId') authorId: string) {
    return this.service.getAuthor(authorId);
  }

  @Post('author')
  @ApiOperation({ summary: 'save an author' })
  async saveAuthor(@Body() author: AuthorDto) {
    return this.service.saveAuthor(author);
  }

  @Put('author')
  @ApiOperation({ summary: 'update an author' })
  async updateAuthor(@Body() author: AuthorDto) {
    return this.service.saveAuthor(author);
  }

  @Delete('author/:authorId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete an author' })
  async deleteAuthor(@Param('authorId') authorId: string) {
    return this.service.deleteAuthor(authorId);
  }

  @Get('genre/:genreId')
  @ApiOperation({ summary: 'get a genre' })
  async getGenre(@Param('genreId') genreId: string) {
    return this.service.getGenre(genreId);
  }

  @Post('genre')
  @ApiOperation({ summary: 'save a genre' })
  async saveGenre(@Body() genre: GenreDto) {
    return this.service.saveGenre(genre);
  }

  @Put('genre')
  @ApiOperation({ summary: 'update a genre' })
  async updateGenre(@Body() genre: GenreDto) {
    return this.service.saveGenre(genre);
  }

  @Delete('genre/:genreId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete a genre' })
  async deleteGenre(@Param('genreId') genreId: string) {
    return this.service.deleteGenre(genreId);
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: 'get a book' })
  async getBook(@Param('bookId') bookId: string) {
    return this.service.getBook(bookId);
  }

  @Post('book')
  @ApiOperation({ summary: 'save a book' })
  async saveBook(@Body() book: BookDto) {
    return this.service.saveBook(book);
  }

  @Put('book')
  @ApiOperation({ summary: 'update a book' })
  async updateBook(@Body() book: BookDto) {
    return this.service.saveBook(book);
  }

  @Delete('book/:bookId')
  @HttpCode(204)
  @ApiOperation({ summary: 'delete a book' })
  async deleteBook(@Param('bookId') bookId: string) {
    return this.service.deleteBook(bookId);
  }

  @Get('suggestions/:authorId')
  @ApiOperation({ summary: 'get book suggestions for an author' })
  async getSuggestions(@Param('authorId') authorId: string) {
    return this.service.suggestBooks(authorId);
  }

  @Get('suggestions/:firstName/:lastName')
  @ApiOperation({ summary: 'get book suggestions for an author' })
  async getSuggestionsByName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    return this.service.createAndSuggestBooks(firstName, lastName);
  }
}
