import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BookDto } from './library.dto';

function validBase(): Record<string, unknown> {
  return { title: 'The Hobbit', authorId: 'abc123', published: '1937-09-21' };
}

describe('BookDto published transform', () => {
  it('passes through a Date instance unchanged', () => {
    const date = new Date('1937-09-21T00:00:00.000Z');
    const dto = plainToInstance(BookDto, { ...validBase(), published: date });
    expect(dto.published).toBeInstanceOf(Date);
    expect(dto.published.toISOString()).toBe(date.toISOString());
  });

  it('converts a date-only string to midnight UTC', () => {
    const dto = plainToInstance(BookDto, { ...validBase(), published: '1988-08-01' });
    expect(dto.published).toBeInstanceOf(Date);
    expect(dto.published.toISOString()).toBe('1988-08-01T00:00:00.000Z');
  });

  it('converts a full ISO string to a Date', () => {
    const dto = plainToInstance(BookDto, {
      ...validBase(),
      published: '1937-09-21T12:00:00.000Z',
    });
    expect(dto.published).toBeInstanceOf(Date);
    expect(dto.published.toISOString()).toBe('1937-09-21T12:00:00.000Z');
  });

  it('fails validation when published is missing', async () => {
    const dto = plainToInstance(BookDto, { title: 'T', authorId: 'a' });
    const errors = await validate(dto);
    const publishedError = errors.find((e) => e.property === 'published');
    expect(publishedError).toBeDefined();
  });
});
