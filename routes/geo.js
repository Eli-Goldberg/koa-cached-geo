'use strict';

const router = require('koa-router')();
var { geoCode } = require('../config/config');
var { requestCache } = require('./middleware');

function validateParams(params) {
  let err;

  if (Object.keys(params).length !== 1) {
    err = { error: `Only 'address' param allowed` };
  }
  else if (!('address' in params)) {
    err = { error: `Missing 'address' param` };
  }

  return err;
}

router.use(requestCache());

// responds to /geocode and /wikiNearby
router.get('/geocode', function* (next) {
  const request = require('koa-request');

  const params = this.query;
  const err = validateParams(params);
  if (err) {
    this.status = 400;
    this.body = err;
    return;
  }

  geoCode = Object.assign(geoCode, { qs: params });
  const response = yield request(geoCode);
  const data = JSON.parse(response.body);

  this.status = 200;

  if (data.results.length == 0) {
    this.body = {};
    return;
  }

  try {
    var [{geometry: {location: {lat, lng: lon}}}] = data.results;
    this.body = { lat, lon };
  } catch (er) {
    this.status = 400;
    this.body = { error: 'Unkown error' }
  }

});

module.exports = router;