'use strict';

const router = require('koa-router')();
const co = require('co');
var { wikiMedia } = require('../config/config');
var { requestCache } = require('./middleware');

router.use(requestCache());

router.get('/wikiNearby', function* (next) {
  const request = require('koa-request');

  const params = this.query;
  const err = validateParams(params);
  if (err) {
    this.status = 400;
    this.body = err;
    return;
  }

  const ggscoord = `${params.lat}|${params.lon}`;
  wikiMedia.qs['ggscoord'] = ggscoord;
  const response = yield request(wikiMedia);
  this.body = yield formatData(response);
  this.status = 200;
});

function validateParams(params) {
  let err;

  if (!('lat' in params && 'lon' in params)) {
    err = { error: `missing 'lat' & 'lon' params` };
  }
  return err;
}

function formatData(response) {
  return function* () {
    let results = [];
    try {

      let body = JSON.parse(response.body);

      if (body.query) {
        const {query: {pages: data}} = body;

        results = Object.keys(data)
          .map((val) => {

            const item = data[val];

            // nested-destructuring default value bug forces to check this 
            if (!item.thumbnail) {
              item.thumbnail = { source: '' };
            }

            var { title, thumbnail: {source: thumbnailUri}, coordinates: [{lat, lon}]} = item;
            return {
              title,
              thumbnailUri,
              coordinates: { lat, lon }
            };
          });
      }

    } catch (err) {
      console.log(err);
    }

    return results;
  };
}

module.exports = router;