'use strict';

const router = require('koa-router')();
const { geoAddress } = require('../config/config');
const request = require('koa-request');

function validateParams(params) {
  var err;

  if (Object.keys(params).length !== 1) {
    err = { error: `Only 'address' param allowed` };
  }
  else if (!('address' in params)) {
    err = { error: `Missing 'address' param` };
  }

  return err;
}

// responds to /geocode and /wikiNearby
router.get('/geocode', function* (next) {
  const params = this.query;
  const err = validateParams(params);
  if (err) {
    this.status = 400;
    this.body = err;
  }
  else {
    var options = {
      url: geoAddress,
      headers: { 'User-Agent': 'request' },
      qs: params
    };

    var response = yield request(options); 
    var data = JSON.parse(response.body);

    this.status = 200;

    if (data.results.length == 0) {
      this.body = { };
      return;
    }

    try { 
      var [{geometry:{location:{lat, lng:lon}}}] = data.results;
      this.body = { lat, lon };
    } catch (er) {
      this.status = 400;
      this.body = { error: 'Unkown error' }
    }
  }

});

module.exports = router;