import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { QuotesService } from './services/quotes/quotes.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly quotesService: QuotesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async getMessages(@Req() request) {
    return this.quotesService.getQuotes(request);
  }
}
