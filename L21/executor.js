const { BinTree } = require('bintrees');

class Executor {
    static create() {
        return new Executor();
    }

    constructor() {
        this.bst = null;
    }

    init(size) {
        const bst = new BinTree((a, b) => a - b);

        for (let j = 0; j < size; j++) {
            bst.insert(Math.floor(Math.random() * 1000 + 1));
        }

        this.bst = bst;
    }

    exec(value) {
        this.bst.find(value);
    }
}

module.exports = {
    Executor
}
