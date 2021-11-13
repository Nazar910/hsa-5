const { MongoClient } = require('mongodb');
const { startServer } = require('./server/index');
const Redis = require('ioredis');

async function init() {
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    await mongoClient.connect();

    const redisClient = new Redis(process.env.REDIS_URL);

    await startServer(mongoClient, redisClient);
}

if (require.main === module) {
    init();
}
