import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, Max, MaxLength } from 'class-validator';

export class AuthorDto {
  @ApiPropertyOptional({
    description: 'Author ID',
    example: 'mvhgr30j5u3mnkk0a6tfct7o',
  })
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Author first name',
    example: 'Jane',
  })
  @MaxLength(191, {
    message: 'First name is too long',
  
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Author last name',
    example: 'Doe',
  })
  @MaxLength(191, {
    message: 'Last name is too long',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Author biography',
    example: 'Jane Doe is a writer',
  })
  @MaxLength(2000, {
    message: 'Biography is too long',
  })
  bio?: string;
}

export class GenreDto {
  @ApiPropertyOptional({
    description: 'Genre ID',
    example: 'tso9ysj1ojgc4xlpblr5dc87',
  })
  genreId?: string;

  @ApiPropertyOptional({
    description: 'The genre name',
    example: 'Science Fiction',
  })
  @MaxLength(191, {
    message: 'Genre name is too long',
  })
  genre: string;
}

export class BookDto {
  @ApiPropertyOptional({
    description: 'Book ID',
    example: 'tso9ysj1ojgc4xlpblr5dc87',
  })
  bookId?: string;

  @ApiPropertyOptional({
    description: 'The title of the book',
    example: 'The Hobbit',
  })
  @MaxLength(191, {
    message: 'Title is too long',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the book',
    example: 'The Hobbit is a fantasy novel',
  })
  @MaxLength(2000, {
    message: 'Description is too long',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The author ID',
    example: 'mvhgr30j5u3mnkk0a6tfct7o',
  })
  authorId: string;

  @ApiPropertyOptional({
    description: 'The genre ID',
    example: 'tso9ysj1ojgc4xlpblr5dc87',
  })
  genreId?: string;

  @ApiPropertyOptional({
    description: 'The date the book was published',
    example: '1937-09-21',
  })
  @IsDateString()
  published: Date;

  @ApiPropertyOptional({
    description: 'The series the book belongs to',
    example: 'The Lord of the Rings',
  })
  @MaxLength(191, {
    message: 'Series is too long',
  })
  series?: string;

  @ApiPropertyOptional({
    description: 'The series number',
    example: 1,
  })
  seriesNumber?: number;

  @ApiPropertyOptional({
    description: 'The edition of the book',
    example: 'First Edition',
  })
  @MaxLength(191, {
    message: 'Edition is too long',
  })
  edition?: string;
}
