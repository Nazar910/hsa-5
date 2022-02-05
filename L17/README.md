# Tasks
* measure BST and Counting sort complexity

# Prerequisites
* node
* npm install
* [gnuplot](http://www.gnuplot.info/)

# Charts, measurements & implementations
* Charts were built using following code:
```javascript
function gnuPlotCmd(testCase, maxTimeRange) {
    execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, nanosec"; set yrange [0:${maxTimeRange}]; plot "./results/${testCase}.dat" with l' > ./results/${testCase}.png`);
}
```
* Measurements were done using:
```javascript
function measureExecutionNanoSec(func) {
    const start = process.hrtime();
    func();
    const stop = process.hrtime(start)
    const endTimeNanos = (stop[0] * 1e9 + stop[1]);

    return endTimeNanos;
}
```
* counting sort [impl](https://github.com/Nazar910/hsa-5/blob/main/L17/counting_sort.js)
* BST [lib](https://github.com/vadimg/js_bintrees)

# BST

## Insert

```javascript
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
```

![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/bst_insert.png?raw=true)

## Search

```javascript
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

```

![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/bst_search.png?raw=true)

## Delete

```javascript
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

```
![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/bst_delete.png?raw=true)

# Couting sort

## Sorted set
```javascript
const fs = require('fs');
const { countingSort } = require('./counting_sort');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 5_000;

const TEST_CASE = 'counting_sort_sorted';
const SORT_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(SORT_DATA_FILE);

const sortStatsWriteStream = fs.createWriteStream(SORT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const input = Array.from(new Array(size)).map(() => randomNumber(size));

    input.sort((a, b) => a - b);

    const sortEndTimeNanos = measureExecutionNanoSec(() => countingSort(input, 1, size));

    sortStatsWriteStream.write(`${size} ${sortEndTimeNanos}\n`);
}

sortStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 300_000));

```
![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/counting_sort_sorted.png?raw=true)

## Reverse sorted set

```javascript
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

```
![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/counting_sort_rev_sorted.png?raw=true)

## Sort set with value that much bigger from other elements

```javascript
const fs = require('fs');
const { countingSort } = require('./counting_sort');
const { measureExecutionNanoSec, gnuPlotCmd, randomNumber, clearFile } = require('./utils');

const MEASUREMENTS_COUNT = 5_000;

const TEST_CASE = 'counting_sort_diff';
const SORT_DATA_FILE = `./results/${TEST_CASE}.dat`;

clearFile(SORT_DATA_FILE);

const sortStatsWriteStream = fs.createWriteStream(SORT_DATA_FILE);

for (let i = 1; i < MEASUREMENTS_COUNT; i++) {
    const size = i;

    const input = Array.from(new Array(size)).map(() => randomNumber(size));

    input.sort((a, b) => a - b);
    input.push(1_000_000);

    const sortEndTimeNanos = measureExecutionNanoSec(() => countingSort(input, 1, size));

    sortStatsWriteStream.write(`${size} ${sortEndTimeNanos}\n`);
}

sortStatsWriteStream.end('', () => gnuPlotCmd(TEST_CASE, 1_000_000));

```

![image](https://github.com/Nazar910/hsa-5/blob/main/L17/results/counting_sort_diff.png?raw=true)

As we can see when dataset contains value that is much different from other elements `Counting sort` starts to degrade.

# Summary

* BST seems to have O(log n) time complexity
* Counting sort seems to have O(n+k) time complexity BUT should be aplied to datasets of elements that does not differ much from each other
