var app = require('../app');
var agent = require('co-supertest').agent(app.listen());
var expect = require('chai').expect;
require('co-mocha');

var request = require('koa-request');
var sinon = require('sinon-es6');
var mockery = require('mockery');
var requestStub;

describe('wikiNearby api', function () {
    var fnError = (res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('error');
    };

    var fakeResult = {
        body: {
            query: {
                pages: {
                    "someId": {
                        "pageid": 1284671,
                        "ns": 0,
                        "title": "Yerba Buena Gardens",
                        "index": 0,
                        "coordinates": [
                            {
                                "lat": 37.785607,
                                "lon": -122.402691,
                                "primary": "",
                                "globe": "earth"
                            }
                        ],
                        "thumbnail": {
                            "source": "/some_path_to_jpg.jpg",
                            "width": 144,
                            "height": 108
                        }
                    }
                }
            }
        }
    }


    before(function (done) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        requestStub = sinon.stub();

        // replace the module `request` with a stub object
        mockery.registerMock('koa-request', requestStub);
        var koaReq = require('koa-request');

        requestStub.returns(function (cb) {
            cb(null, { body: JSON.stringify(fakeResult) });
        });

        done();

    });
    after(function (done) {
        mockery.disable();
        done();
    });

    it('should only accept both lat+lon params', function* () {
        yield agent
            .get('/wikiNearby')
            .expect(400)
            .expect(fnError)
            .end();

        yield agent
            .get('/wikiNearby')
            .query({
                lat: -31,
            })
            .expect(400)
            .expect(fnError)
            .end();

        yield agent
            .get('/wikiNearby')
            .query({
                lon: 38.05,
            })
            .expect(400)
            .expect(fnError)
            .end();
    });

    it('should return an array of objects', function* () {
        yield agent
            .get('/wikiNearby')
            .query({
                lat: 37.7856,
                lon: -122.403
            })
            .expect(200)
            .end();
    });

    it('should cache wikiNearby after the first time', function* () {
        yield agent
            .post('/purgeCache')
            .expect(200)
            .end();

        yield agent
            .get('/wikiNearby')
            .query({
                lat: 37.7856,
                lon: -122.403
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers).not.to.include.key("x-cached");
            })
            .end();
        yield agent
            .get('/wikiNearby')
            .query({
                lat: 37.7856,
                lon: -122.403
            })
            .expect(200)
            .expect(function (res) {
                expect(res.headers).to.include.key("x-cached");
            })
            .end();
    });
});