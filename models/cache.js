'use strict';

var co = require('co'),
    cache = [];

module.exports = {
    save: function (url, res) {
        return function* () {
            cache[url] = res;
        }
    },
    get: function (url) {
        return function* () {
            var res = ((url in cache) ? cache[url] : null);
            return res;
        }
    },
    getAll: function () {
        return function* () {
            return cache;
        }
    },
    purge: function () {
        return function* () {
            cache = [];
        }
    }
};