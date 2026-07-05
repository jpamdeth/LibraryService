import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return structured health status', () => {
      const result = appController.getHealth();

      expect(result).toMatchObject({
        service: 'LibraryService',
        status: 'ok',
        version: '1.0',
      });
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});
