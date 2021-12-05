import { Injectable } from '@nestjs/common';
import { knex } from './knex';

export interface User {
  id: number;
  name: string;
  date: string;
}

const ReqModeMap = {
  0: 'users_0',
  1: 'users_1',
  2: 'users_2'
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getUsersByDateEq(date: Date): Promise<User[]> {
    const users = await knex.select('*').from('users').where('date', date).limit(10);

    return users;
  }

  async getUsersByDateGt(date: Date): Promise<User[]> {
    const users = await knex.select('*').from('users').where('date', '>', date).limit(10);

    return users;
  }

  async insert10Users(reqMode: 0 | 1 | 2) {
    const tableName = ReqModeMap[reqMode];

    await knex(tableName)
      .insert(
        Array.from(new Array(10))
          .map((e, i) => ({
            name: `name-${i}`,
            date: new Date(),
          }))
      );
  }
}
