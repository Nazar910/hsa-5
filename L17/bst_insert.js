const { BinTree } = require('bintrees');
const fs = require('fs');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 30_000;

const TEST_CASE = 'bst_insert';
const INSERT_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(INSERT_DATA_FILE);

const insertStatsWriteStream = fs.createWriteStream(INSERT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber(size));
    }

    const insertEndTimeNanos = measureExecutionNanoSec(() => bst.insert(randomNumber(size)));

    insertStatsWriteStream.write(`${size} ${insertEndTimeNanos}\n`);
}

insertStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 2000));
