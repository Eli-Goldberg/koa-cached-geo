'use strict';

const router = require('koa-router')();
const request = require('koa-request');
var { wikiMedia } = require('../config/config');

function validateParams(params) {
  let err;

  if (!('lat' in params && 'lon' in params)) {
    err = { error: `missing 'lat' & 'lon' params` };
  }
  return err;
}

router.get('/wikiNearby', function* (next) {
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
  if (!response.body.query) {
    this.body = [];
  } else {

    const {query: {pages: data}} = JSON.parse(response.body);

    let results = Object.keys(data)
      .map((val) => {

        const item = data[val];

        // nested-destructuring default value bug forces to check this 
        if (!item.thumbnail) {
          item.thumbnail = { source: '' };
        }

        try {
          var { title, thumbnail: {source: thumbnailUri}, coordinates: [{lat, lon}]} = item;
          return {
            title,
            thumbnailUri,
            coordinates: { lat, lon }
          };
        } catch (err) {
          console.log(err);
        }
      });

    this.body = results;
  }
  this.status = 200;
});

module.exports = router;