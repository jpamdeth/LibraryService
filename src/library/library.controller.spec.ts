import { Test, TestingModule } from '@nestjs/testing';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { AuthorDto, BookDto, GenreDto } from './library.dto';
import { Author, Book, Genre } from './library.models';

describe('LibraryController', () => {
  let sheetController: LibraryController;
  let sheetService: DeepMocked<LibraryService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [
        {
          provide: LibraryService,
          useValue: createMock<LibraryService>(),
        },
      ],
    }).compile();

    sheetController = app.get<LibraryController>(LibraryController);
    sheetService = app.get(LibraryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthors', () => {
    it('should return all authors', async () => {
      const authors = [{ id: '1', firstName: 'John' }];
      sheetService.getAuthors.mockResolvedValue(authors as any);
      expect(await sheetController.getAuthors()).toBe(authors);
    });
  });

  describe('getBooks', () => {
    it('should return all books', async () => {
      const books = [
        { id: '1', title: 'The Hobbit', authorId: '1', published: new Date() },
      ];
      sheetService.getBooks.mockResolvedValue(books as any);
      expect(await sheetController.getBooks()).toBe(books);
    });
  });

  describe('getGenres', () => {
    it('should return all genres', async () => {
      const genres = [{ id: '1', genre: 'Fantasy' }];
      sheetService.getGenres.mockResolvedValue(genres as any);
      expect(await sheetController.getGenres()).toBe(genres);
    });
  });

  describe('getAuthor', () => {
    it('should return an author', async () => {
      const authorId = '1';
      const author: Author = { id: authorId, firstName: 'John Doe' };
      sheetService.getAuthor.mockResolvedValue(author as any);
      expect(await sheetController.getAuthor(authorId)).toBe(author);
    });
  });

  describe('saveAuthor', () => {
    it('should save an author', async () => {
      const author: AuthorDto = { firstName: 'John Doe' };
      sheetService.createAuthor.mockResolvedValue(author as any);
      expect(await sheetController.saveAuthor(author)).toBe(author);
    });
  });

  describe('updateAuthor', () => {
    it('should update an author', async () => {
      const author: AuthorDto = { authorId: '1', firstName: 'John Doe' };
      sheetService.updateAuthor.mockResolvedValue(author as any);
      expect(await sheetController.updateAuthor(author, '1')).toBe(author);
    });
  });

  describe('deleteAuthor', () => {
    it('should delete an author', async () => {
      const authorId = '1';
      await sheetController.deleteAuthor(authorId);
      expect(sheetService.deleteAuthor).toHaveBeenCalledWith(authorId);
    });
  });

  describe('getGenre', () => {
    it('should return a genre', async () => {
      const genreId = '1';
      const genre: Genre = { id: genreId, genre: 'Fiction' };
      sheetService.getGenre.mockResolvedValue(genre as any);
      expect(await sheetController.getGenre(genreId)).toBe(genre);
    });
  });

  describe('saveGenre', () => {
    it('should save a genre', async () => {
      const genre: GenreDto = { genre: 'Fiction' };
      sheetService.createGenre.mockResolvedValue(genre as any);
      expect(await sheetController.saveGenre(genre)).toBe(genre);
    });
  });

  describe('updateGenre', () => {
    it('should update a genre', async () => {
      const genre: GenreDto = { genreId: '1', genre: 'Fiction' };
      sheetService.updateGenre.mockResolvedValue(genre as any);
      expect(await sheetController.updateGenre(genre, '1')).toBe(genre);
    });
  });

  describe('deleteGenre', () => {
    it('should delete a genre', async () => {
      const genreId = '1';
      await sheetController.deleteGenre(genreId);
      expect(sheetService.deleteGenre).toHaveBeenCalledWith(genreId);
    });
  });

  describe('getBook', () => {
    it('should return a book', async () => {
      const bookId = '1';
      const book: Book = {
        id: bookId,
        title: 'The Hobbit',
        authorId: '1',
        published: new Date(),
      };
      sheetService.getBook.mockResolvedValue(book as any);
      expect(await sheetController.getBook(bookId)).toBe(book);
    });
  });

  describe('saveBook', () => {
    it('should save a book', async () => {
      const book: BookDto = {
        bookId: '1',
        title: 'The Hobbit',
        authorId: '1',
        published: new Date(),
      };
      sheetService.createBook.mockResolvedValue(book as any);
      expect(await sheetController.saveBook(book)).toBe(book);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const book: BookDto = {
        bookId: '1',
        title: 'The Hobbit',
        authorId: '1',
        published: new Date(),
      };
      sheetService.updateBook.mockResolvedValue(book as any);
      expect(await sheetController.updateBook(book, '1')).toBe(book);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for an author', async () => {
      sheetService.suggestBooks.mockResolvedValue('suggestions');
      expect(await sheetController.getSuggestions('1', { apiKey: 'key' })).toBe(
        'suggestions',
      );
      expect(sheetService.suggestBooks).toHaveBeenCalledWith('1', 'key');
    });
  });

  describe('getSuggestionsByName', () => {
    it('should return suggestions for an author by name', async () => {
      sheetService.createAndSuggestBooks.mockResolvedValue('suggestions');
      expect(
        await sheetController.getSuggestionsByName('Jane', 'Doe', {
          apiKey: 'key',
        }),
      ).toBe('suggestions');
      expect(sheetService.createAndSuggestBooks).toHaveBeenCalledWith(
        'Jane',
        'Doe',
        'key',
      );
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const bookId = '1';
      await sheetController.deleteBook(bookId);
      expect(sheetService.deleteBook).toHaveBeenCalledWith(bookId);
    });
  });
});
