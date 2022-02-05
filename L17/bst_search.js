const { BinTree } = require('bintrees');
const fs = require('fs');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 30_000;

const TEST_CASE = 'bst_search';
const SEARCH_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(SEARCH_DATA_FILE);

const searchStatsWriteStream = fs.createWriteStream(SEARCH_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber(size));
    }

    const searchEndTimeNanos = measureExecutionNanoSec(() => bst.find(randomNumber(size)));

    searchStatsWriteStream.write(`${size} ${searchEndTimeNanos}\n`);
}

searchStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 2000));
