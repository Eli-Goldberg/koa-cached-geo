const router = require('koa-router')();

// responds to /geocode and /wikiNearby
router.get('/geocode', function* (next) {
  
  const params = this.query;
  if (Object.keys(params).length !== 1) {
    this.status = 400
    this.body = { error: `Only 'address' param allowed` };
  }
  else if (!('address' in params)) {
    this.status = 400;
    this.body = { error: `Missing 'address' param` };
  } else {
    this.status = 200;
    this.body = {
      'lat': 456.456,
      'lon': 123.123
    };
  }

  
});

module.exports = router;