var app = require('../app');
var request = require('co-supertest').agent(app.listen());
var { assert, expect } = require('chai');
var Cache = require('../models/cache');
require('co-mocha');

describe('Cache', function () {
    describe('model', function () {
        var url = '/geoCode?address="Jerusalem"';
        var remoteRes = { lat: 10.0, lon: -5.1 };
        beforeEach(function* () {
            yield Cache.purge();
        });
        it('should save and get the same obj from the cache', function* () {
            yield Cache.save(url, remoteRes);

            var cachedRes = yield Cache.get(url);

            expect(cachedRes).to.equal(remoteRes);
        });
        it('should purge previously saved requests', function* () {
            yield Cache.save(url, remoteRes);

            yield Cache.purge();

            var cachedRes = yield Cache.get(url);
            expect(cachedRes === null);
        });
    })

    describe('api', function () {
        before(function* () {
            yield request
                .post('/purgeCache')
                .expect(200)
                .end();
        });
    });
});