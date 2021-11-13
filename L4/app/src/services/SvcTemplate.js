const assert = require('assert');

function getKeyName(name) {
    return `record_${name}`;
}

const REDIS_TTL_SEC = 25;

class SvcTemplate {
    constructor(collection, redisClient) {
        assert.ok(collection, 'Collection required');
        assert.ok(redisClient, 'redisClient required');
        this.collection = collection;
        this.redisClient = redisClient;
    }

    async get(name) {
        const { redisClient } = this;

        const cacheKeyName = getKeyName(name);
        const ttl = await redisClient.ttl(cacheKeyName);

        if (ttl > 0) {
            const val = await redisClient.get(cacheKeyName);

            return val;
        }

        const a = await this.collection.findOne({
            name
        });

        await redisClient.setex(cacheKeyName, REDIS_TTL_SEC, a);

        return a;
    }
}

module.exports = {
    SvcTemplate
};
