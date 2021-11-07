class SvcTemplate {
    constructor(collection) {
        this.collection = collection;
    }

    async get(name) {
        const a = await this.collection.findOne({
            name
        });

        console.log('a', a);

        return a;
    }

    async create(data) {
        return this.collection.insertOne(data);
    }
}

module.exports = {
    SvcTemplate
};
