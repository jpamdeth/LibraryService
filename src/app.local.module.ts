import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LibraryModule } from './library/library.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Local development version - No AWS services
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    LibraryModule,
    // AWS services commented out for local development
    // PSConfigModule.register({...}),
    // CognitoAuthModule.registerAsync({...}),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
