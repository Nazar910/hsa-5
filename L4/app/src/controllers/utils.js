function middleWarifyAsync(asyncFunc) {
    return async(req, res, next) => {
        try {
            await asyncFunc(req, res);
        } catch (e) {
            next(e);
        }
        next();
    };
};

module.exports = {
    middleWarifyAsync
};
