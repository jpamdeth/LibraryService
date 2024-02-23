import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { OpenAIService } from '../openai/openai.service';
import { AuthorDto, BookDto, GenreDto } from './library.dto';
import { Author } from './library.models';

describe('LibraryService', () => {
  let service: LibraryService;
  let prismaService: DeepMocked<PrismaService>;
  let openaiService: DeepMocked<OpenAIService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>(),
        },
        {
          provide: OpenAIService,
          useValue: createMock<OpenAIService>(),
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    prismaService = module.get(PrismaService);
    openaiService = module.get(OpenAIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an author', async () => {
    const author: AuthorDto = {
      firstName: 'Jane',
      lastName: 'Doe',
    };
    prismaService.author.create = jest.fn().mockResolvedValue(author);
    const result = await service.createAuthor(author);
    expect(prismaService.author.create).toHaveBeenCalledWith({ data: author });
    expect(result).toEqual(author);
  });

  it ('should update an author', async () => {
    const author: AuthorDto = {
      authorId: 'mvhgr30j5u3mnkk0a6tfct7o',
      firstName: 'Jane',
      lastName: 'Doe',
    };
    prismaService.author.update = jest.fn().mockResolvedValue(author);
    const result = await service.updateAuthor(author, author.authorId);
    expect(prismaService.author.update).toHaveBeenCalledWith({
      where: { id: author.authorId },
      data: author,
    });
    expect(result).toEqual(author);
  });

  it('should create a genre', async () => {
    const genre: GenreDto = {
      genre: 'Science Fiction',
    };
    prismaService.genre.create = jest.fn().mockResolvedValue(genre);
    const result = await service.createGenre(genre);
    expect(prismaService.genre.create).toHaveBeenCalledWith({ data: genre });
    expect(result).toEqual(genre);
  });

  it('should update a genre', async () => {
    const genre: GenreDto = {
      genreId: 'mvhgr30j5u3mnkk0a6tfct7o',
      genre: 'Science Fiction',
    };
    prismaService.genre.update = jest.fn().mockResolvedValue(genre);
    const result = await service.updateGenre(genre, genre.genreId);
    expect(prismaService.genre.update).toHaveBeenCalledWith({
      where: { id: genre.genreId },
      data: genre,
    });
    expect(result).toEqual(genre);
  });

  it('should create a book', async () => {
    const book: BookDto = {
      title: 'The Hobbit',
      authorId: 'mvhgr30j5u3mnkk0a6tfct7o',
      published: new Date(),
    };
    prismaService.book.create = jest.fn().mockResolvedValue(book);
    const result = await service.createBook(book);
    expect(prismaService.book.create).toHaveBeenCalledWith({ data: book });
    expect(result).toEqual(book);
  });

  it ('should update a book', async () => {
    const book: BookDto = {
      bookId: 'mvhgr30j5u3mnkk0a6tfct7o',
      title: 'The Hobbit',
      authorId: 'mvhgr30j5u3mnkk0a6tfct7o',
      published: new Date(),
    };
    prismaService.book.update = jest.fn().mockResolvedValue(book);
    const result = await service.updateBook(book, book.bookId);
    expect(prismaService.book.update).toHaveBeenCalledWith({
      where: { id: book.bookId },
      data: book,
    });
    expect(result).toEqual(book);
  });

  it('should get an author', async () => {
    const author = {
      id: 'mvhgr30j5u3mnkk0a6tfct7o',
      firstName: 'Jane',
      lastName: 'Doe',
    };
    prismaService.author.findUnique = jest.fn().mockResolvedValue(author);
    const result = await service.getAuthor(author.id);
    expect(prismaService.author.findUnique).toHaveBeenCalledWith({
      where: { id: author.id },
      include: { 
        books: {
          include: {
            genre: true 
          },
        },
      },
    });
    expect(result).toEqual(author);
  });

  it('should get a genre', async () => {
    const genre = {
      id: 'mvhgr30j5u3mnkk0a6tfct7o',
      genre: 'Science Fiction',
    };
    prismaService.genre.findUnique = jest.fn().mockResolvedValue(genre);
    const result = await service.getGenre(genre.id);
    expect(prismaService.genre.findUnique).toHaveBeenCalledWith({
      where: { id: genre.id },
    });
    expect(result).toEqual(genre);
  });

  it('should get a book', async () => {
    const book = {
      id: 'mvhgr30j5u3mnkk0a6tfct7o',
      title: 'The Hobbit',
      authorId: 'mvhgr30j5u3mnkk0a6tfct7o',
      published: new Date(),
    };
    prismaService.book.findUnique = jest.fn().mockResolvedValue(book);
    const result = await service.getBook(book.id);
    expect(prismaService.book.findUnique).toHaveBeenCalledWith({
      where: { id: book.id },
    });
    expect(result).toEqual(book);
  });

  it('should delete an author', async () => {
    prismaService.author.delete = jest.fn();
    const result = await service.deleteAuthor('test');
    expect(prismaService.author.delete).toHaveBeenCalledWith({
      where: { id: 'test' },
    });
  });

  it('should delete a genre', async () => {
    prismaService.genre.delete = jest.fn();
    const result = await service.deleteGenre('test');
    expect(prismaService.genre.delete).toHaveBeenCalledWith({
      where: { id: 'test' },
    });
  });

  it('should delete a book', async () => {
    prismaService.book.delete = jest.fn();
    const result = await service.deleteBook('test');
    expect(prismaService.book.delete).toHaveBeenCalledWith({
      where: { id: 'test' },
    });
  });

  it('should create and suggest books', async () => {
    const author: Author = {
      id: 'mvhgr30j5u3mnkk0a6tfct7o',
      firstName: 'Jane',
      lastName: 'Doe',
    };
    prismaService.author.create = jest.fn().mockResolvedValue(author);
    prismaService.author.findUnique = jest.fn().mockResolvedValue(author);
    openaiService.getSuggestions = jest
        .fn()
        .mockResolvedValue('your suggestions');
    const result = await service.createAndSuggestBooks(author.firstName, author.lastName);
    expect(prismaService.author.create).toHaveBeenCalledWith({data: {firstName: author.firstName, lastName: author.lastName}});
    expect(result).toEqual('your suggestions');
  });
});
