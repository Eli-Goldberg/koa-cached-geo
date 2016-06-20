const router = require('koa-router')();

// responds to /geocode and /wikiNearby
router.get('/geocode', function* (next) {
  this.body = 'geocode';
});

router.get('/wikiNearby', function* (next) {
  this.body = 'wikiNearby';
});

module.exports = router;