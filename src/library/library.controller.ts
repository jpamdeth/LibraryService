import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('beatsheet')
export class LibraryController {
  constructor(private readonly beatService: LibraryService) {}

  
}
