const { BinTree } = require('bintrees');
const fs = require('fs');
const { execSync } = require('child_process');

function randomNumber(size) {
    return Math.floor(Math.random() * size + 1);
}

const MEASUREMENTS_COUNT = 30_000;

const SEARCH_DATA_FILE = './results/bst_search.dat';

execSync(`echo '' > ${SEARCH_DATA_FILE}`);

const searchStatsWriteStream = fs.createWriteStream(SEARCH_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber(size));
    }

    const searchStart = process.hrtime();
    bst.find(randomNumber(size));
    const searchStop = process.hrtime(searchStart)
    const searchEndTimeNanos = (searchStop[0] * 1e9 + searchStop[1]);

    searchStatsWriteStream.write(`${size} ${searchEndTimeNanos}\n`);
}

searchStatsWriteStream.end('', () => execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, nanosec"; set yrange [0:2000]; plot "${SEARCH_DATA_FILE}" with l' > ./results/bst_search.png`));
