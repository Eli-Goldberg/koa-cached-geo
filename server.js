const config = require('./config/config'),
    app = require('./app');

app.listen(config.port);
console.log(`Listening on port ${config.port}`);