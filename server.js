var express = require('express'),
    http    = require('http'),
    path    = require('path');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('appDir', path.dirname(require.main.filename));

var server = http.createServer(app);
var io = require('socket.io').listen(server.listen(app.get('port')));

require('./lib/config')(app, io);
require('./lib/routes')(app, io);

server.listen(app.get('port'), function() {
  console.log('NodeJS app is running on port', app.get('port'));
});