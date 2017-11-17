var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/create', ensureAuthenticated, function (req, res) {
    var id = Math.round((Math.random() * 100000000));
    res.redirect('/chat/' + id);
});

router.get('/chat/:id', ensureAuthenticated, function (req, res) {
    res.render('chat');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;