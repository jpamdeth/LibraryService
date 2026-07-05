import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

export function configureApp(app: INestApplication): void {
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use((req, _res, next) => {
    req.setTimeout(30000);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('LibraryService')
    .setDescription(
      'A service to store authors, genres and books. Also, to get recommendations on new ones.',
    )
    .setVersion('1.0')
    .addTag('library')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          messages: Object.values(error.constraints),
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: false,
      skipMissingProperties: false,
    }),
  );
}
