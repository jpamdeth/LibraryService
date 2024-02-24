import { ApiPropertyOptional } from '@nestjs/swagger';

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
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Author last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Author biography',
    example: 'Jane Doe is a writer',
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
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the book',
    example: 'The Hobbit is a fantasy novel',
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
  published: Date;

  @ApiPropertyOptional({
    description: 'The series the book belongs to',
    example: 'The Lord of the Rings',
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
  edition?: string;
}
