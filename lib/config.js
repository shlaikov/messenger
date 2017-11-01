var express = require('express');

module.exports = function(app, io) {
    // Tell express where it can find the templates
    app.set('views', app.get('appDir') + '/views/pages/');
    // Initialize the ejs template engine
    app.set('view engine', 'ejs');
    // Make the files in the public folder available to the world
    app.use(express.static(app.get('appDir') + '/public'));
}