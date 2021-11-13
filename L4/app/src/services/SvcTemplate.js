const assert = require('assert');

function getKeyName(name) {
    return `record_${name}`;
}

const REDIS_TTL_SEC = 5;

class SvcTemplate {
    constructor(collection, redisClient) {
        assert.ok(collection, 'Collection required');
        assert.ok(redisClient, 'redisClient required');
        this.collection = collection;
        this.redisClient = redisClient;
    }

    async reCompute(name) {
        const startTime = Date.now();
        const result = await this.collection.findOne({
            name
        });
        const delta = Date.now() - startTime;

        const cacheKeyName = getKeyName(name);
        await this.redisClient.setex(cacheKeyName, REDIS_TTL_SEC, JSON.stringify({ data: result, delta }));

        return result;
    }

    shouldRecompute(delta, beta, expiry) {
        return Date.now() - delta * beta * Math.log(Math.random()) >= expiry;
    }

    async get(name) {
        const { redisClient } = this;

        const cacheKeyName = getKeyName(name);
        const [jsonStr, ttl] = await Promise.all([
            redisClient.get(cacheKeyName),
            redisClient.ttl(cacheKeyName)
        ]);

        if (ttl > 0) {
            const { data, delta } = JSON.parse(jsonStr);

            if (this.shouldRecompute(delta, 1, Date.now() + ttl)) {
                const result = await this.reCompute(name);
                return result;
            }

            return data;
        }

        const result = await this.reCompute(name);

        return result;
    }
}

module.exports = {
    SvcTemplate
};
