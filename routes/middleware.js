'use strict';

var Cache = require('../models/cache'),
    Usage = require('../models/usage'),
    { auth: credentials } = require('../config/config');

module.exports = {
    errHandler: function () {
        return function* (next) {
            try {
                var start = new Date();
                yield next;
                var end = new Date();
                if (start && end) {
                    this.set('X-Response-Time', (end - start) + 'ms');
                }

            } catch (err) {
                this.status = err.status || 500;
                this.body = err.message;
                this.app.emit('error', err, this);
            }
        }
    },
    requestCache: function () {
        return function* (next) {

            const { originalUrl } = this;
            const cachedRes = yield Cache.get(originalUrl);

            if (!!cachedRes) {
                this.body = cachedRes.body;
                this.status = cachedRes.status;
                this.set('X-Cached', true);
            } else {

                yield next;

                if (!!this.body) {
                    yield Cache.save(originalUrl, { body: this.body, status: this.status });
                }
            }
        }
    },
    usage: function () {
        return function* (next) {
            const { originalUrl, req: { method } } = this;
            yield Usage.save(`${method} ${originalUrl}`);
            yield next;
        }
    },
    auth: function () {
        return function* (next) {
            if (this.request.auth == null) {
                this.body = 'Please log in.'
                return;
            }

            if (this.request.auth.user !== credentials.user ||
                this.request.auth.password(credentials.pass)) {
                this.body = 'Unauthorized acces'
                delete this.request.auth;
                return;
            }

            yield next;
        }
    }
}