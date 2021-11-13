const { middleWarifyAsync } = require('./utils');

class ControllerTemplate {
    constructor(service) {
        this.service = service;
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
