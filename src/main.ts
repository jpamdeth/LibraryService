import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('LibraryService')
    .setDescription(
      'A service to store authors, genres and books.  Also, to get recommendations on new ones.',
    )
    .setVersion('1.0')
    .addTag('library')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          messages: Object.values(error.constraints),
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: false,
      skipMissingProperties: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
