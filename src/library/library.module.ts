import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [PrismaModule, OpenAIModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
