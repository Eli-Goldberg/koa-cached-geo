var app = require('../server');
var request = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;
require('co-mocha');

describe('wikiNearby api', function () {
    var fnError = (res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('error');
    };

    it('should only accept both lat+lon params', function* () {
        yield request
            .get('/wikiNearby')
            .expect(400)
            .expect(fnError)
            .end();

        yield request
            .get('/wikiNearby')
            .query({
                lat: -31,
            })
            .expect(400)
            .expect(fnError)
            .end();

        yield request
            .get('/wikiNearby')
            .query({
                lon: 38.05,
            })
            .expect(400)
            .expect(fnError)
            .end();
    });

    it('should return an array of objects', function* () {
        yield request
            .get('/wikiNearby')
            .query({
                lat: 37.7856,
                lon: -122.403
            })
            .expect(200)
            .end();
    });
});