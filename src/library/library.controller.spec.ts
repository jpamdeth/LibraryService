import { Test, TestingModule } from '@nestjs/testing';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

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
});
