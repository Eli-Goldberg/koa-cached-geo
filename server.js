const config = require('./config/config');
const app = module.exports = require('koa')();
const middleware = require('./routes/middleware');
const geo = require('./routes/geo');
const wiki = require('./routes/wiki');
require('koa-qs')(app);

// const cache = require('./routes/cache');

app.use(middleware());
app.use(geo.routes());
app.use(wiki.routes());

if (!module.parent) {
    app.listen(config.port);
    console.log(`Listening on port ${config.port}`);
}

