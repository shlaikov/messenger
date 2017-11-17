var passport      = require('passport'),
    VKStrategy    = require('passport-vkontakte').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var mongo    = require('mongodb'),
    mongoose = require('mongoose');

var express = require('express'),
    path    = require('path');

var app = express();

mongoose.createConnection('mongodb://localhost:27017/messenger', {
    promiseLibrary: require('bluebird')
});
var db = mongoose.connection;

app.set('port', (process.env.PORT || 5000));
app.set('appDir', path.dirname(require.main.filename));

var io = require('socket.io').listen(app.listen(app.get('port')));

require('./lib/config')(app, passport, io);
require('./lib/main-controller')(app, io);

console.log('Your messenger is running on http://localhost:' + app.get('port'));