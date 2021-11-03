const http = require('http');
const { MongoClient }  = require('mongodb');
const { Client } = require('@elastic/elasticsearch');

const mongoClient = new MongoClient('mongodb://localhost');
const elasticClient = new Client({
    node: 'http://localhost:9200'
})

const MONGO_DB = 'test_db';
const MOVIES = 'movies';

async function seed() {
    const database = mongoClient.db(MONGO_DB);
    const movies = database.collection(MOVIES);

    await movies.deleteMany({});

    const docs = Array.from(new Array(1000)).map((e, i) => ({
        name: `Movie-${i}`,
        rate: 'good',
        description: 'some really long description',
        actors: [
            'that guy',
            'another guy',
            'john doe',
            'example com',
            'etc'
        ]
    }));

    docs.push({
        name: `Really-good-movie`,
        rate: 'excellent',
        description: 'the best description',
        actors: [
            'that guy',
            'another guy',
            'john doe',
            'example com',
            'etc'
        ]
    });

    await movies.insertMany(docs);
}

async function doSmth() {
    const database = mongoClient.db(MONGO_DB);
    const movies = database.collection(MOVIES);

    await movies.findOne({});
    await elasticClient.info();
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
    await seed();
    server.listen('8001');
}

main();
