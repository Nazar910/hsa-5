const { middleWarifyAsync } = require('./utils');

class ControllerTemplate {
    constructor(service) {
        this.service = service;
    }

    async create(req, res, next) {
        return middleWarifyAsync(async(req, res) => {
            const data = req.body;
            const createdRecord = await this.service.create(data);
            res.data = createdRecord;
            res.statusCode = 201;
        })(req, res, next);
    }

    async get(req, res, next) {
        return middleWarifyAsync(async(req, res) => {
            const { name } = req.params;
            const record = await this.service.get(name);
            res.data = record;
        })(req, res, next);
    }
}

module.exports = {
    ControllerTemplate
};
