import { Injectable } from '@nestjs/common';
import { createConnection } from 'mysql2';
import { promisify } from 'util';
// import { knex as createKnex } from 'knex';

// const knex = createKnex({
//   client: 'mysql',
//   connection: {
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'your_database_user',
//     password: 'your_database_password',
//     database: 'l8_db',
//   },
// });

export interface User {
  id: number;
  name: string;
  data_of_birth: Date;
}

@Injectable()
export class AppService {
  private connection = createConnection(
    'mysql://root:example@localhost:3306/l8_db',
  );

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(): Promise<User[]> {
    const users = await promisify(this.connection.query.bind(this))(
      'SELECT * FROM users',
    );

    return users;
  }
}
