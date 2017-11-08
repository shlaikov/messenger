var express = require('express');

module.exports = function(app, io) {
    app.set('views', app.get('appDir') + '/views/pages/');
    app.set('view engine', 'ejs');

    app.use(express.static(app.get('appDir') + '/public'));
}