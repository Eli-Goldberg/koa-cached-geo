const config = require('./config/config');
const app = module.exports = require('koa')();
const {errHandler} = require('./routes/middleware');
const apiGeo = require('./routes/geo');
const apiWiki = require('./routes/wiki');
const apiCache = require('./routes/cache');
require('koa-qs')(app);

// const cache = require('./routes/cache');

app.use(errHandler());
app.use(apiCache.routes());
app.use(apiGeo.routes());
app.use(apiWiki.routes());

if (!module.parent) {
    app.listen(config.port);
    console.log(`Listening on port ${config.port}`);
}

