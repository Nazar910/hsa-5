class BaseError {
    constructor(msg) {
        this.msg = msg;
    }

    toJSON() {
        return {
            title: this.title,
            detail: this.msg,
            code: this.code,
            status: this.status
        };
    }
}

class NotFound extends BaseError {
    constructor(msg) {
        super(msg);
        this.title = 'Not found';
        this.status = 404;
        this.code = 404;
    }
}

class BadRequest extends BaseError {
    constructor(msg) {
        super(msg);
        this.title = 'Bad request';
        this.status = 400;
        this.code = 400;
    }
}

class Unauthorized extends BaseError {
    constructor(msg) {
        super(msg);
        this.title = 'Unauthorized';
        this.status = 401;
        this.code = 401;
    }
}
module.exports = {
    NotFound,
    BadRequest,
    Unauthorized
};
