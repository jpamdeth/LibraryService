import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { OpenAIService } from '../openai/openai.service';

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
});
