const assert = require('assert');
const pg = require('knex')({
    client: 'pg',
    connection: 'postgres://testuser:testpassword@localhost:5432/test_db'
});

const ROW_COUNT = Number(process.env.ROW_COUNT);

assert.ok(ROW_COUNT, 'ROW_COUNT is required')

async function initClient() {
    return pg;
}

async function main() {
    const client = await initClient();

    const perfKey = 'performance';
    console.time(perfKey);
    for (let i = 0; i < ROW_COUNT; i++) {
        await client.select('*')
            .from('books')
            .where('id', Math.floor(Math.random() * 1_000_000));
    }
    console.timeEnd(perfKey);
    await client.destroy();
}

if (require.main === module) {
    main();
}
