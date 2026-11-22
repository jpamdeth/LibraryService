# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run startup          # Full init: generate Prisma client, run migrations, start dev server
npm run start:dev        # Start with hot reload (assumes DB is ready)

# Build
npm run build            # Compile TypeScript via NestJS CLI

# Lint & Format
npm run lint             # ESLint with auto-fix
npm run format           # Prettier format

# Tests
npm test                 # Unit tests (src/**/*.spec.ts)
npm run test:e2e         # E2E tests (test/app.e2e-spec.ts)
npm run test:cov         # Unit tests with coverage

# Run a single test file or test by name
npm test -- --testPathPatterns=library.service
npm test -- --testNamePattern="should create an author"

# Database
npx prisma migrate dev   # Create and apply a new migration
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma studio        # Open Prisma Studio GUI
```

Requires a `.env` file with `DATABASE_URL` pointing to a MariaDB/MySQL instance. Docker Compose (`docker-compose.yml`) provides a full local environment.

## Architecture

**LibraryService** is a NestJS REST API for managing books, authors, and genres with an AI-powered recommendation feature.

### Module Structure

- **AppModule** — Root module. Configures global throttling (100 req/min), Swagger UI at `/api`, and global validation/exception pipes.
- **LibraryModule** — All business logic. `LibraryController` handles routing; `LibraryService` implements CRUD for authors, genres, and books plus the AI suggestion endpoint.
- **PrismaModule** — Global singleton wrapping the Prisma client. Injected as `PrismaService` wherever DB access is needed.
- **OpenAIModule** — Wraps the OpenAI SDK. Used exclusively by `LibraryService` for the `POST /library/suggestions/:authorId` endpoint, which sends author/book context to GPT and returns recommendations.

### Data Model

Three Prisma models in `prisma/schema.prisma`:
- **Author** (1:N Books) — `firstName`, `lastName`, `bio`
- **Genre** (1:N Books) — `genre`
- **Book** — `title`, `description`, `authorId`, `genreId`, `published` (Date), `series`, `seriesNumber`, `edition`

Dates with no time component are stored and returned as date-only strings (transformed at the service layer).

### Request Lifecycle

```
HTTP → LibraryController (DTOs + class-validator) → LibraryService → PrismaService → MariaDB
                                                          ↓
                                                    OpenAIService (suggestions only)
```

All DTOs live in `src/library/dto/`. Global `ValidationPipe` enforces DTO constraints. A global exception filter normalizes error responses.

### Testing Conventions

- Unit tests use `@golevelup/ts-jest` `createMock<T>()` for deep-mocked dependencies — no manual mock objects.
- E2E tests (`test/app.e2e-spec.ts`) hit a real database and clean up created records after each test.
- The OpenAI service is mocked in unit tests; real API calls only occur in integration.
