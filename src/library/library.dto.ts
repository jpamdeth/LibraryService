import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthorDto {
  @ApiPropertyOptional({
    description: 'Author ID',
    example: 'mvhgr30j5u3mnkk0a6tfct7o',
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Author first name',
    example: 'Jane',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  @MaxLength(191, {
    message: 'First name is too long',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Author last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  @MaxLength(191, {
    message: 'Last name is too long',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Author biography',
    example: 'Jane Doe is a writer',
  })
  @IsOptional()
  @IsString()
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
  @IsOptional()
  @IsString()
  genreId?: string;

  @ApiPropertyOptional({
    description: 'The genre name',
    example: 'Science Fiction',
  })
  @IsNotEmpty({ message: 'Genre name is required' })
  @IsString()
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
  @IsOptional()
  @IsString()
  bookId?: string;

  @ApiPropertyOptional({
    description: 'The title of the book',
    example: 'The Hobbit',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(191, {
    message: 'Title is too long',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the book',
    example: 'The Hobbit is a fantasy novel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Description is too long',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The author ID',
    example: 'mvhgr30j5u3mnkk0a6tfct7o',
  })
  @IsNotEmpty({ message: 'Author ID is required' })
  @IsString()
  authorId: string;

  @ApiPropertyOptional({
    description: 'The genre ID',
    example: 'tso9ysj1ojgc4xlpblr5dc87',
  })
  @IsOptional()
  @IsString()
  genreId?: string;

  @ApiPropertyOptional({
    description: 'The date the book was published',
    example: '1937-09-21T00:00:00.000Z',
  })
  @Transform(({ value }) => {
    if (value instanceof Date) return value;
    // If it's just a date string like "1988-08-01", append time component
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value + 'T00:00:00.000Z');
    }
    return new Date(value);
  })
  published: Date;

  @ApiPropertyOptional({
    description: 'The series the book belongs to',
    example: 'The Lord of the Rings',
  })
  @IsOptional()
  @IsString()
  @MaxLength(191, {
    message: 'Series is too long',
  })
  series?: string;

  @ApiPropertyOptional({
    description: 'The series number',
    example: 1,
  })
  @IsOptional()
  @IsPositive({ message: 'Series number must be positive' })
  seriesNumber?: number;

  @ApiPropertyOptional({
    description: 'The edition of the book',
    example: 'First Edition',
  })
  @IsOptional()
  @IsString()
  @MaxLength(191, {
    message: 'Edition is too long',
  })
  edition?: string;
}
