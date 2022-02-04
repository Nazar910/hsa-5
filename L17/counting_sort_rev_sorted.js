const fs = require('fs');
const { execSync } = require('child_process');
const { countingSort } = require('./counting_sort');

function randomNumber(size) {
    return Math.floor(Math.random() * size + 1);
}

const MEASUREMENTS_COUNT = 5_000;

const SORT_DATA_FILE = './results/counting_sort_rev_sorted.dat';

execSync(`echo '' > ${SORT_DATA_FILE}`);

const searchStatsWriteStream = fs.createWriteStream(SORT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const input = Array.from(new Array(size)).map(() => randomNumber(size));

    input.sort((a, b) => b - a);

    const sortStart = process.hrtime();
    countingSort(input, 1, size);
    const sortStop = process.hrtime(sortStart)
    const sortEndTimeNanos = (sortStop[0] * 1e9 + sortStop[1]);

    searchStatsWriteStream.write(`${size} ${sortEndTimeNanos}\n`);
}

searchStatsWriteStream.end('', () => execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, nanosec"; set yrange [0:300000]; plot "${SORT_DATA_FILE}" with l' > ./results/counting_sort_rev_sorted.png`));
