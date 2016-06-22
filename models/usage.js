'use strict';

var usage = [];

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
            return usage;
        }
    },
    clear: function() {
        return function *() {
            usage = [];
        }
    }
};