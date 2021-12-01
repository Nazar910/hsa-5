import { knex as createKnex } from 'knex';

export const knex = createKnex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'example',
    database: 'l8_db',
  },
});
