const { MONGO_DB, MOVIES } = require('./constants');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient('mongodb://localhost');

async function seed() {
    await mongoClient.connect();
    const database = mongoClient.db(MONGO_DB);
    const movies = database.collection(MOVIES);

    await movies.deleteMany({});

    const docs = Array.from(new Array(1000000)).map((e, i) => ({
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


seed();
