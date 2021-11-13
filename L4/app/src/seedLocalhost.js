const { MongoClient } = require('mongodb');

async function seed() {
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    const collection = mongoClient.db('test1').collection('col_a');

    const docs = Array.from(new Array(10_000)).map((e, i) => ({
        name: `foo-${i}`,
        index: i,
    }));

    await collection.insertMany(docs);
    await mongoClient.close();
}

if (require.main === module) {
    seed().then(() => console.log('Done'));
}

module.exports = { seed }
