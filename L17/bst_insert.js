const { BinTree } = require('bintrees');
const fs = require('fs');
const { execSync } = require('child_process');

function randomNumber(size) {
    return Math.floor(Math.random() * size + 1);
}

const MEASUREMENTS_COUNT = 30_000;

const INSERT_DATA_FILE = './results/bst_insert.dat';

execSync(`echo '' > ${INSERT_DATA_FILE}`);

const insertStatsWriteStream = fs.createWriteStream(INSERT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber(size));
    }

    const insertStart = process.hrtime();
    bst.insert(randomNumber(size));
    const insertStop = process.hrtime(insertStart)
    const insertEndTimeNanos = (insertStop[0] * 1e9 + insertStop[1]);

    insertStatsWriteStream.write(`${size} ${insertEndTimeNanos}\n`);
}

insertStatsWriteStream.end('', () => execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, nanosec"; set yrange [0:2000]; plot "${INSERT_DATA_FILE}" with l' > ./results/bst_insert.png`));
