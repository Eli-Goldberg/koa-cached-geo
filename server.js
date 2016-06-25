const config = require('./config/config'),
    app = require('./app');

// if (!module.parent) {
app.listen(config.port);
console.log(`Listening on port ${config.port}`);
// }