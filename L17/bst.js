const { BinTree } = require('bintrees');
const fs = require('fs');
const { execSync } = require('child_process');

function randomNumber() {
    return Math.floor(Math.random() * 100);
}

const MEASUREMENTS_COUNT = 5000;

const INSERT_DATA_FILE = './results/bst_insert.dat';
const SEARCH_DATA_FILE = './results/bst_search.dat';

execSync(`echo '' > ${INSERT_DATA_FILE}`);
execSync(`echo '' > ${SEARCH_DATA_FILE}`);

const insertStatsWriteStream = fs.createWriteStream(INSERT_DATA_FILE);
const searchStatsWriteStream = fs.createWriteStream(SEARCH_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < size; j++) {
        bst.insert(randomNumber());
    }

    const randNum = randomNumber();
    const insertStart = process.hrtime();
    bst.insert(randNum);
    const insertStop = process.hrtime(insertStart)
    const insertEndTimeMs = (insertStop[0] * 1e9 + insertStop[1]) / 1e6;

    insertStatsWriteStream.write(`${size} ${insertEndTimeMs}\n`);

    const searchStart = process.hrtime();
    bst.find(randNum);
    const searchStop = process.hrtime(searchStart)
    const searchEndTimeMs = (searchStop[0] * 1e9 + searchStop[1]) / 1e6;

    searchStatsWriteStream.write(`${size} ${searchEndTimeMs}\n`);
}

insertStatsWriteStream.end('', () => execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, ms"; plot "${INSERT_DATA_FILE}" with l' > ./results/bst_insert.png`));
searchStatsWriteStream.end('', () => execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, ms"; plot "${SEARCH_DATA_FILE}" with l' > ./results/bst_search.png`));
