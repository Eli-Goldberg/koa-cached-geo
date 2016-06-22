const auth = require('http-auth'),
    { auth: { user, pass } } = require('../config/config'),
 basic = auth.basic({
    realm: "auth",
    function (username, password, callback) { 
        // Custom authentication
        // Use callback(error) if you want to throw async error.
        callback(username === user && password === pass);
    }
});

module.exports = function() {
    return (auth.koa(basic))
    };