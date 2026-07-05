import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumberString,
  validateSync,
  IsDecimal,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  NODE_ENV: string = 'development';

  @IsOptional()
  @IsNumberString({}, { message: 'PORT must be a numeric string' })
  PORT: string = '3000';

  @IsOptional()
  @IsString()
  OPENAI_MODEL: string = 'gpt-4o';

  @IsOptional()
  @IsNumberString({}, { message: 'OPENAI_MAX_TOKENS must be a numeric string' })
  OPENAI_MAX_TOKENS: string = '1000';

  @IsOptional()
  @IsDecimal(
    {},
    { message: 'OPENAI_TEMPERATURE must be a decimal numeric string' },
  )
  OPENAI_TEMPERATURE: string = '0.7';
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
