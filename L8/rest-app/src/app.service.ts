import { Injectable } from '@nestjs/common';
import { knex } from './knex';

export interface User {
  id: number;
  name: string;
  date: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(date: Date): Promise<User[]> {
    const users = await knex.select('*').from('users').where('date', date);

    return users;
  }
}
