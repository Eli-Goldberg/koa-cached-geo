'use strict';

const co = require('co'),
    usage = [];

module.exports = {
    save: function (url) {
        return function* () {
            if (usage.indexOf(url) == -1) {
                usage.push(url);
            }
        }
    },
    getAll: function () {
        return function* () {
            yield usage;
        }
    },
    clean: function () {
        return function* () {
            usage = [];
        }
    }
};