import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';

interface GetUsersQuery {
  date: Date;
  op: '=' | '>';
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
    if (query.op === '=') {
      return this.appService.getUsersByDateEq(query.date);
    } else if (query.op === '>') {
      return this.appService.getUsersByDateGt(query.date);
    } else {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }
  }
}
