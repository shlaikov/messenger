module.exports = function (app, io) {
    require('./controllers/socket-chat')(io);
}