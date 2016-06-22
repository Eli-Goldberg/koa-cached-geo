'use strict';

const router = require('koa-router')();
var Cache = require('../models/cache');

// responds to /geocode and /wikiNearby
router.get('/purgeCache', function* (next) {
  yield Cache.purge();
  this.status = 200;
});

module.exports = router;