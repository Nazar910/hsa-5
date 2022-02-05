const fs = require('fs');
const { countingSort } = require('./counting_sort');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 5_000;

const TEST_CASE = 'counting_sort_rev_sorted';
const SORT_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(SORT_DATA_FILE);;

const sortStatsWriteStream = fs.createWriteStream(SORT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const input = Array.from(new Array(size)).map(() => randomNumber(size));

    input.sort((a, b) => b - a);

    const sortEndTimeNanos = measureExecutionNanoSec(() => countingSort(input, 1, size));

    sortStatsWriteStream.write(`${size} ${sortEndTimeNanos}\n`);
}

sortStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 300_000));
