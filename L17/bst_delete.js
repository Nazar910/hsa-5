const { BinTree } = require('bintrees');
const fs = require('fs');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 10_000;

const TEST_CASE = 'bst_delete';
const SEARCH_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(SEARCH_DATA_FILE);

const deleteStatsWriteStream = fs.createWriteStream(SEARCH_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber(size));
    }

    const searchEndTimeNanos = measureExecutionNanoSec(() => bst.remove(randomNumber(size)));

    deleteStatsWriteStream.write(`${size} ${searchEndTimeNanos}\n`);
}

deleteStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 4000));
