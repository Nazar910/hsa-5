const express = require('express');
const assert = require('assert');
const cors = require('cors');

const { SvcTemplate } = require('../services/SvcTemplate');
const { ControllerTemplate } = require('../controllers/ControllerTemplate');
const { NotFound } = require('../errors');

const MONGO_DB = 'test1';
const COLLECTION_A = 'col_a';
const COLLECTION_B = 'col_b';

async function startServer(mongoClient) {
    assert.ok(mongoClient);
    const db = mongoClient.db(MONGO_DB);
    const aSvc = new SvcTemplate(db.collection(COLLECTION_A));
    const bSvc = new SvcTemplate(db.collection(COLLECTION_B));

    const aController = new ControllerTemplate(aSvc);
    const bController = new ControllerTemplate(bSvc);

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({ origin: '*' }));

    app.get('/get-a/:name', aController.get.bind(aController));
    app.get('/get-b/:name', bController.get.bind(bController));
    app.post('/create-a', aController.create.bind(aController));
    app.post('/create-b', bController.create.bind(bController));

    app.use((req, res, next) => {
        if (res.data == null) {
            return next(new NotFound());
        }

        const data = res.data;
        const status = res.statusCode;

        const body = {
            data
        };
        return res.status(status).json(body);
    });

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        console.error(err);
        const status = err.status || 500;
        const errors = [JSON.stringify(err, Object.getOwnPropertyNames(err))];
        return res.status(status).json({
            errors
        });
    });

    await new Promise(resolve => app.listen(8002, () => resolve()));

    return app;
}

module.exports = {
    startServer
};
