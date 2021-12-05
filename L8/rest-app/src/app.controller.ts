import { Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
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

  @Post('/users')
  async insert10Users(@Query() query: { reqMode: 0 | 1 | 2 }) {
    await this.appService.insert10Users(query.reqMode);
  }
}
