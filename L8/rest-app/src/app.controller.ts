import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

interface GetUsersQuery {
  date: Date;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  async getUsers(@Query() query: GetUsersQuery) {
    return this.appService.getUsers(query.date);
  }
}
