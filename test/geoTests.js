var app = require('../server');
var request = require('co-supertest').agent(app.listen());
require('co-mocha');

describe('Testing geocode api', function() {
    
    it('should be available', function *() {
        yield request
            .get('/geocode')
            .expect(200)
            .end();
    });
});