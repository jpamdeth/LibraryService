import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIService } from './openai.service';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

jest.mock('openai');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let mockCreate: jest.Mock;
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    mockCreate = jest.fn();

    const mockOpenAI = {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(
      () => mockOpenAI as any,
    );

    configService = {
      get: jest.fn((key: string, defaultValue: unknown) => defaultValue),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return suggestions from OpenAI', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test suggestion' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    const result = await service.getSuggestions(
      [{ role: 'user', content: 'Test message' }],
      'test-api-key',
    );

    expect(result).toBe('Test suggestion');
    expect(mockCreate).toHaveBeenCalledWith({
      messages: [{ role: 'user', content: 'Test message' }],
      model: 'gpt-4o',
      max_tokens: 1000,
      temperature: 0.7,
    });
  });

  it('should handle empty response from OpenAI', async () => {
    const mockCompletion = {
      choices: [{ message: { content: null } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    const result = await service.getSuggestions(
      [{ role: 'user', content: 'Test message' }],
      'test-api-key',
    );

    expect(result).toBe('No suggestions available');
  });

  it('should handle OpenAI API errors', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'));

    await expect(
      service.getSuggestions(
        [{ role: 'user', content: 'Test message' }],
        'test-api-key',
      ),
    ).rejects.toThrow('Failed to get suggestions from OpenAI');
  });

  it('should reuse OpenAI instances for same API key', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test suggestion' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    // Call with same API key twice
    await service.getSuggestions(
      [{ role: 'user', content: 'Test message 1' }],
      'test-api-key',
    );

    await service.getSuggestions(
      [{ role: 'user', content: 'Test message 2' }],
      'test-api-key',
    );

    // OpenAI constructor should only be called once
    expect(OpenAI).toHaveBeenCalledTimes(1);
  });

  it('should not store raw API keys as cache keys', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test suggestion' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    await service.getSuggestions(
      [{ role: 'user', content: 'Test message' }],
      'test-api-key',
    );

    expect((service as any).openaiInstances.has('test-api-key')).toBe(false);
  });

  it('should create separate instances for different API keys', async () => {
    const mockCompletion = {
      choices: [{ message: { content: 'Test suggestion' } }],
    };

    mockCreate.mockResolvedValue(mockCompletion);

    // Call with different API keys
    await service.getSuggestions(
      [{ role: 'user', content: 'Test message 1' }],
      'test-api-key-1',
    );

    await service.getSuggestions(
      [{ role: 'user', content: 'Test message 2' }],
      'test-api-key-2',
    );

    // OpenAI constructor should be called twice
    expect(OpenAI).toHaveBeenCalledTimes(2);
  });

  it('should use configured OpenAI request defaults', async () => {
    configService.get.mockImplementation(
      (key: string, defaultValue: unknown) =>
        ({
          OPENAI_MODEL: 'gpt-4.1-mini',
          OPENAI_MAX_TOKENS: 500,
          OPENAI_TEMPERATURE: 0.2,
        })[key] ?? defaultValue,
    );

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Configured suggestion' } }],
    });

    await service.getSuggestions(
      [{ role: 'user', content: 'Test message' }],
      'test-api-key',
    );

    expect(mockCreate).toHaveBeenCalledWith({
      messages: [{ role: 'user', content: 'Test message' }],
      model: 'gpt-4.1-mini',
      max_tokens: 500,
      temperature: 0.2,
    });
  });
});
