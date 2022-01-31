const BinTree = require('bintrees').BinTree;

for (let i = 0; i < 100; i++) {
    const tree = new BinTree((a, b) => a - b);
    const size = Math.floor(Math.random() * 10_000 + 10); // size vary [10 .. 10_000]

    for (let j = 0; j < size; j++) {
        tree.insert(Math.floor(Math.random() * 100));
    }

    // tree.each(node => console.log('node', node))
}
