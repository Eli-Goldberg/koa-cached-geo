const app = module.exports = require('koa')(),
    config = require('./config/config'),
    apiGeo = require('./routes/geo'),
    apiWiki = require('./routes/wiki'),
    apiCache = require('./routes/cache'),
    apiUsage = require('./routes/usage'),
    { errHandler, usage } = require('./routes/middleware');

require('koa-qs')(app);

// const cache = require('./routes/cache');

app.use(errHandler());
app.use(usage());
app.use(apiUsage.routes());
app.use(apiCache.routes());
app.use(apiGeo.routes());
app.use(apiWiki.routes());

if (!module.parent) {
    app.listen(config.port);
    console.log(`Listening on port ${config.port}`);
}

