const router = require('koa-router')();

router.get('/wikiNearby', function* (next) {
  const params = this.query;

  if (!('lat' in params && 'lon' in params)) {
    this.status = 400;
    this.body = { error: `missing 'lat' & 'lon' params`};
    return;
  }

  this.status = 200;
  this.body = [];
});

module.exports = router;