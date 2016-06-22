var app = require('../server');
var request = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;
require('co-mocha');

describe('Geocode api', function () {
    var fnError = (res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('error');
    };

    it('should only accept one param', function* () {
        yield request
            .get('/geocode')
            .expect(400)
            .expect(fnError)
            .end();

        yield request
            .get('/geocode')
            .query({
                address: 'RishonLezion',
                state: 'Israel'
            })
            .expect(400)
            .expect(fnError)
            .end();
    });

    it('should only allow the \'address\' param', function* () {
        yield request
            .get('/geocode')
            .query({
                addres: 'Jerusalem'
            })
            .expect(400)
            .expect(fnError)
            .end();
    });

    it('should return an object with lat+lon', function* () {
        yield request
            .get('/geocode')
            .query({
                address: 'Tel Aviv'
            })
            .expect(function (res) {
                expect(res.body).to.be.an('object');
                expect(Object.keys(res.body).length).to.equal(2);
                expect(res.body).to.include.keys('lat', 'lon');
            })
            .expect(200)
            .end();
    });

    it('should cache geoCode after the first time', function* () {
        yield request
            .get('/geoCode')
            .query({
                address: 'Tel aviv'
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers).not.to.include.key("x-cached");
            })
            .end();
        yield request
            .get('/geoCode')
            .query({
                address: 'Tel aviv'
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers).to.include.key("x-cached");
            })
            .end();
    });
});