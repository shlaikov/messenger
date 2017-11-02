var debug = require('debug')('io');

var express = require('express'),
    path    = require('path');

var app = express();

app.set('port', (process.env.PORT || 5050));
app.set('appDir', path.dirname(require.main.filename));

var io = require('socket.io').listen(app.listen(app.get('port')));

require('./lib/config')(app, io);
require('./lib/routes')(app, io);

console.log('Your messenger is running on http://localhost:' + app.get('port'));