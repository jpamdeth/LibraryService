import { Controller, Get } from '@nestjs/common';

export interface HealthStatus {
  service: string;
  status: 'ok';
  version: string;
  timestamp: string;
}

@Controller()
export class AppController {
  @Get('health')
  getHealth(): HealthStatus {
    return {
      service: 'LibraryService',
      status: 'ok',
      version: '1.0',
      timestamp: new Date().toISOString(),
    };
  }
}
