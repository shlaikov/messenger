var express      = require('express'),
    session      = require('express-session'),
    validator    = require('express-validator'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser');

var flash = require('connect-flash');

var home = require('./routes/home');
var users = require('./routes/users');

module.exports = function (app, passport, io) {
    app.set('views', app.get('appDir') + '/views/pages/');
    app.set('view engine', 'ejs');

    app.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true
    }));

    app.use(express.static(app.get('appDir') + '/public'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(validator({
        errorFormatter: function (param, msg, value) {
            var namespace = param.split('.'),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }));

    app.use(flash());

    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg   = req.flash('error_msg');
        res.locals.error       = req.flash('error');
        res.locals.user        = req.user || null;
        next();
    });

    app.use('/', home);
    app.use('/users', users);
}