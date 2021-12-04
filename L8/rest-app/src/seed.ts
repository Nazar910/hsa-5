import { knex } from './knex';

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

const TOTAL_COUNT = 40_000_000;
const INSERT_BATCH_SIZE = 10_000;
const initDate = new Date('1960-01-01').getTime();

async function insertBatch(from: number, to: number) {
  return knex('users').insert(
    [...range(from, to)].map((e, i) => ({
      name: `user-${i + from}`,
      date: new Date(initDate + (i + from) * 48 * 1000)
        .toISOString()
        .split('T')[0],
    })),
  );
}

export async function seed() {
  await knex.raw('DELETE FROM users');
  console.log('Cleaned user table');

  console.time('insert');
  for (
    let step = 0;
    step + 4 * INSERT_BATCH_SIZE <= TOTAL_COUNT;
    step += 4 * INSERT_BATCH_SIZE
  ) {
    await Promise.all([
      insertBatch(step, step + INSERT_BATCH_SIZE - 1),
      insertBatch(step + INSERT_BATCH_SIZE, step + 2 * INSERT_BATCH_SIZE - 1),
      insertBatch(
        step + 2 * INSERT_BATCH_SIZE,
        step + 3 * INSERT_BATCH_SIZE - 1,
      ),
      insertBatch(
        step + 3 * INSERT_BATCH_SIZE,
        step + 4 * INSERT_BATCH_SIZE - 1,
      ),
    ]);
    console.log(`Inserted batch #${step}`);
  }
  console.timeEnd('insert');
  console.log('Done');
}

if (require.main === module) {
  seed()
    .catch((e) => console.error(e))
    .then(() => knex.destroy());
}
