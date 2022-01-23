const assert = require('assert');
const pg = require('knex')({
    client: 'pg',
    connection: 'postgres://testuser:testpassword@localhost:5432/test_db'
});

const MEASURE_PERFORMANCE = process.env.MEASURE_PERFORMANCE;
const ROW_COUNT = Number(process.env.ROW_COUNT);

assert.ok(ROW_COUNT, 'ROW_COUNT is required')

const CHUNK_SIZE = 1000;

async function initClient() {
    return pg;
}

function generateRows(startId, endId) {
    const rows = Array.from(new Array(endId - startId)).fill('').map((e, i) => {
        const id = i + startId;
        return {
            id,
            category_id: id % 2 + 1,
            author: `Some-${id}`,
            title: `Some-title-${id}`,
            year: Math.min(id % 2000 + 1960, 2022)
        }
    });

    return rows;
}

async function getMaxId(client) {
    const { rows } = await client.raw('SELECT MAX(id) as max_id FROM books');

    if (rows.length) {
        return Number(rows[0].max_id) || 0;
    }

    return 0;
}

async function main() {
    const client = await initClient();

    const perfKey = 'performance';
    const [start, end] = MEASURE_PERFORMANCE ? [() => console.time(perfKey), () => console.timeEnd(perfKey)] : [() => ({}), () => ({})];

    const startId = await getMaxId(client);

    start();
    const endId = ROW_COUNT + startId;
    for (let i = startId, j = Math.min(i + CHUNK_SIZE, endId); i < endId; i += CHUNK_SIZE, j = Math.min(i + CHUNK_SIZE, endId)) {
        const generatedRows = generateRows(i, j);
        await client('books')
            .insert(generatedRows);
    }
    end();
    await client.destroy();
}

if (require.main === module) {
    main();
}
