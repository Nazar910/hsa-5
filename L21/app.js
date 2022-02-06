const app = require('express')();
const { BinTree } = require('bintrees');

function createTree(size) {
    const tree = new BinTree((a, b) => a - b);

    for (let i = 0; i < size; i++) {
        tree.insert(Math.floor(Math.random() * 100 + 1));
    }

    return tree;
}

app.get('/bench/:size', (req, res) => {
    const { size } = req.params;

    const tree = createTree(size);

    const result = tree.find(Math.floor(Math.random() * 100 + 1));

    res.send(`${result}`);
    res.statusCode = 200;
    res.end();
});

app.listen(8080, () => console.log('Server started'));
