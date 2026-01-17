import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('LibraryService (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.genre.deleteMany();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('up and running!');
    });
  });

  describe('/library/authors', () => {
    it('should create and retrieve an author', async () => {
      const authorData = { firstName: 'John', lastName: 'Doe' };

      const createResponse = await request(app.getHttpServer())
        .post('/library/authors')
        .send(authorData)
        .expect(201);

      const authorId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/library/authors/${authorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe('John');
          expect(res.body.lastName).toBe('Doe');
        });
    });

    it('should validate author input', async () => {
      const invalidAuthorData = { firstName: '', lastName: 'Doe' };

      return request(app.getHttpServer())
        .post('/library/authors')
        .send(invalidAuthorData)
        .expect(400);
    });

    it('should get all authors', async () => {
      // Create test authors
      await request(app.getHttpServer())
        .post('/library/authors')
        .send({ firstName: 'John', lastName: 'Doe' });

      await request(app.getHttpServer())
        .post('/library/authors')
        .send({ firstName: 'Jane', lastName: 'Smith' });

      return request(app.getHttpServer())
        .get('/library/authors')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
        });
    });
  });

  describe('/library/genres', () => {
    it('should create and retrieve a genre', async () => {
      const genreData = { genre: 'Science Fiction' };

      const createResponse = await request(app.getHttpServer())
        .post('/library/genres')
        .send(genreData)
        .expect(201);

      const genreId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/library/genres/${genreId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.genre).toBe('Science Fiction');
        });
    });
  });

  describe('/library/books', () => {
    it('should create and retrieve a book with author', async () => {
      // First create an author
      const authorResponse = await request(app.getHttpServer())
        .post('/library/authors')
        .send({ firstName: 'J.R.R.', lastName: 'Tolkien' });

      const authorId = authorResponse.body.id;

      const bookData = {
        title: 'The Hobbit',
        authorId: authorId,
        published: '1937-09-21T00:00:00.000Z',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/library/books')
        .send(bookData)
        .expect(201);

      const bookId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/library/books/${bookId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('The Hobbit');
          expect(res.body.authorId).toBe(authorId);
        });
    });

    it('should validate book input', async () => {
      const invalidBookData = { title: '', authorId: 'invalid-id' };

      return request(app.getHttpServer())
        .post('/library/books')
        .send(invalidBookData)
        .expect(400);
    });
  });
});
