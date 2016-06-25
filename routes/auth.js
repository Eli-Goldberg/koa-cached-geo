const auth = require('http-auth'),
    { auth: { user, pass } } = require('../config/config'),
 basic = auth.basic({
    realm: "auth",
    function (username, password, callback) { 
        callback(username === user && password === pass);
    }
});

module.exports = function() {
    return (auth.koa(basic))
    };