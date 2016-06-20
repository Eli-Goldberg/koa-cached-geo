const config = require('./config/config');
const app = module.exports =  require('koa')();
const middleware = require('./routes/middleware');
const geo = require('./routes/geo');
const cache = require('./routes/cache');

app.use(middleware());
app.use(geo.routes());

if (!module.parent) app.listen();

console.log(`Listening on port ${config.port}`);

