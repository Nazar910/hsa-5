const { BinTree } = require('bintrees');

const CYCLES_COUNT = 10_000;

for (let i = 1 ; i < CYCLES_COUNT; i++) {
    const bst = new BinTree((a, b) => a - b);

    for (let j = 0; j < i; j++) {
        bst.insert(Math.floor(Math.random() * 1000 + 1));
    }
}
