const { MongoClient } = require('mongodb');
const { startServer } = require('./server/index');

async function init() {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    await startServer(mongoClient);
}

if (require.main === module) {
    init();
}
