const http = require('http');
const { MongoClient }  = require('mongodb');
const { Client } = require('@elastic/elasticsearch');
const { MONGO_DB, MOVIES } = require('./constants');

const mongoClient = new MongoClient('mongodb://mongodb');
const elasticClient = new Client({
    node: 'http://elasticsearch:9200'
})

async function doSmth() {
    const database = mongoClient.db(MONGO_DB);
    const movies = database.collection(MOVIES);

    await movies.findOne({});
    await elasticClient.search({
        index: MOVIES,
        body: {
            query: {
                match_all: {}
            }
        }
    });
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        await doSmth();
        res.statusCode = 200;
        res.write(JSON.stringify({ foo: 'bar' }));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
});

async function main() {
    await mongoClient.connect();
    server.listen('8001');
}

main();
