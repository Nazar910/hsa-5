const app = require('express')();
const { Executor } = require('./executor');
const executor = Executor.create();
executor.init(10);

app.get('/', (req, res) => {
    const result = executor.exec(5);

    res.send(`${result}`);
    res.statusCode = 200;
    res.end();
});

app.listen(8080, () => console.log('sever started'));
