import 'reflect-metadata';
import { validate } from './env.validation';

describe('env validate()', () => {
  it('passes when DATABASE_URL is present', () => {
    expect(() =>
      validate({ DATABASE_URL: 'mysql://localhost/test' }),
    ).not.toThrow();
  });

  it('throws when DATABASE_URL is missing', () => {
    expect(() => validate({})).toThrow();
  });

  it('defaults NODE_ENV to development when not provided', () => {
    const result = validate({ DATABASE_URL: 'mysql://localhost/test' });
    expect(result.NODE_ENV).toBe('development');
  });

  it('defaults PORT to 3000 when not provided', () => {
    const result = validate({ DATABASE_URL: 'mysql://localhost/test' });
    expect(result.PORT).toBe('3000');
  });

  it('accepts explicit NODE_ENV and PORT values', () => {
    const result = validate({
      DATABASE_URL: 'mysql://localhost/test',
      NODE_ENV: 'production',
      PORT: '8080',
    });
    expect(result.NODE_ENV).toBe('production');
    expect(result.PORT).toBe('8080');
  });
});
