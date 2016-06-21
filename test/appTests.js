var app = require('../server');
var request = require('co-supertest').agent(app.listen());
require('co-mocha');

describe('Testing app api', function() {
    it('should retrieve a 404 on \'/\'', function *() {
        yield request
            .get('/')
            .expect(404)
            .end();
    });
});