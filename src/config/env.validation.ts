import { plainToInstance } from 'class-transformer';
import { IsString, IsOptional, IsNumberString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  NODE_ENV: string = 'development';

  @IsOptional()
  @IsNumberString({}, { message: 'PORT must be a numeric string' })
  PORT: string = '3000';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
