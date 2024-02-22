import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Author {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  books?: Book[];
}

export class Genre {
  id: string;
  genre: string;
}

export class Book {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  genreId?: string;
  genre?: Genre;
  published: Date;
  series?: string;
  seriesNumber?: number;
  edition?: string;
}
