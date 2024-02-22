import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LibraryModule } from './library/library.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
