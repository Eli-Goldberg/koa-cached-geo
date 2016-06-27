var app = require('../app');
var agent = require('co-supertest').agent(app.listen());
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
chai.use(require('chai-subset'));
require('co-mocha');

var request = require('koa-request');
var sinon = require('sinon-es6');
var mockery = require('mockery');
var requestStub;

describe('Geocode api', function () {
    var fnError = (res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('error');
    };

    var testedResult = {
        "lat": 31.768319,
        "lon": 35.21371
    };

    var fakeResult = {
        "results": [{
            "geometry": {
                "location": {
                    lat: testedResult.lat,
                    lng: testedResult.lon
                }
            }
        }]
    };

    before(function (done) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        requestStub = sinon.stub();

        // replace the module `request` with a stub object
        mockery.registerMock('koa-request', requestStub);

        requestStub.returns(function (cb) {
            cb(null, { body: JSON.stringify(fakeResult) });
        });

        done();

    });
    after(function (done) {
        mockery.disable();
        done();
    });

    it('should only accept one param', function* () {
        yield agent
            .get('/geocode')
            .expect(400)
            .expect(fnError)
            .end();

        yield agent
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
        yield agent
            .get('/geocode')
            .query({
                addres: 'Jerusalem'
            })
            .expect(400)
            .expect(fnError)
            .end();
    });

    it('should return an object with lat+lon', function* () {
        yield agent
            .get('/geocode')
            .query({
                address: 'Tel Aviv'
            })
            .expect(function (res) {
                expect(res.body).to.be.an('object');
                res.body.should.containSubset(testedResult);
            })
            .expect(200)
            .end();
    });

    it('should cache geoCode after the first time', function* () {

        yield agent
            .get('/geoCode')
            .query({
                address: 'Tel aviv'
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers).not.to.include.key("x-cached");
            })
            .end();
        yield agent
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