'use strict';

const router = require('koa-router')(),
  Usage = require('../models/usage'),
  auth = require('koa-basic-auth'),
  {auth: {user, pass}} = require('../config/config');

router.use(auth({ name: user, pass: pass }));

// responds to /geocode and /wikiNearby
router.get('/usage', function* (next) {
  this.body = yield Usage.getAll();
  this.status = 200;
});

module.exports = router;