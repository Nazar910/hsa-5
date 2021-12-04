import { knex as createKnex } from 'knex';

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } =
  process.env;

export const knex = createKnex({
  client: 'mysql2',
  connection: {
    host: MYSQL_HOST || '127.0.0.1',
    port: Number(MYSQL_PORT) || 3306,
    user: MYSQL_USER || 'root',
    password: MYSQL_PASSWORD || 'example',
    database: MYSQL_DATABASE || 'l8_db',
  },
});
