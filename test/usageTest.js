var app = require('../server');
var request = require('co-supertest').agent(app.listen());
var Cache = require('../models/cache');
var Usage = require('../models/usage');
var { assert, expect } = require('chai');
var { auth: { user, pass} } = require('../config/config');
require('co-mocha');

describe('Usage', function () {
    describe('model', function () {
        beforeEach(function* () {
            yield Usage.clear();
        });
        it('should not allow unauthenticated users', function* () {
            yield request
                .get('/usage')
                .expect(401)
                .end();
        });
        it('should initially return an empty list', function* () {
            yield request
                .get('/usage')
                .auth(user, pass)
                .expect(200)
                // addressing to /usage also counts as a request
                .expect(["GET /usage"])
                .end();
        });
        it('should be able to collect multiple requests', function* () {
            // make a random request
            yield request
                .post('/purgeCache')
                .expect(200)
                .end();

            // make a second request
            yield request
                .get('/usage')
                .auth(user, pass)
                .expect(200)
                .expect(function (res) {
                    expect(Array.isArray(res.body));
                    expect(res.body.length == 2);
                })
                .end();
        });
    });
});