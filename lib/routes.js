var gravatar = require('gravatar');

module.exports = function (logger, app, io) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/create', function (req, res) {
        var id = Math.round((Math.random() * 100000000));
        res.redirect('/chat/' + id);
    });

    app.get('/chat/:id', function (req, res) {
        res.render('chat');
    });

    var chat = io.on('connection', function (socket) {
        // When the client emits the 'load' event, reply with the 
        // number of people in this chat room
        socket.on('load', function (data) {
            var room = findClientsSocket(io, data);

            if (room.length === 0) {
                socket.emit('peopleinchat', {
                    number: 0
                });
            } else if (room.length === 1) {
                socket.emit('peopleinchat', {
                    number: 1,
                    user:   room[0].username,
                    avatar: room[0].avatar,
                    id:     data
                });
            } else if (room.length >= 2) {
                chat.emit('tooMany', {
                    boolean: true
                });
            }
        });

        // When the client emits 'login', save his name and avatar,
        // and add them to the room
        socket.on('login', function (data) {
            var room = findClientsSocket(io, data.id);

            if (room.length < 2) {
                // Use the socket object to store data. Each client gets
                // their own unique socket object
                socket.username = data.user;
                socket.room     = data.id;
                socket.avatar   = gravatar.url(data.avatar, {
                    s: '140',
                    r: 'x',
                    d: 'mm'
                });

                // Tell the person what he should use for an avatar
                socket.emit('img', socket.avatar);

                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) {
                    var usernames = [],
                        avatars   = [];

                    usernames.push(room[0].username);
                    usernames.push(socket.username);

                    avatars.push(room[0].avatar);
                    avatars.push(socket.avatar);

                    // Send the startChat event to all the people in the
                    // room, along with a list of people that are in it.
                    chat.in(data.id).emit('startChat', {
                        boolean: true,
                        id:      data.id,
                        users:   usernames,
                        avatars: avatars
                    });
                }
            } else {
                socket.emit('tooMany', {
                    boolean: true
                });
            }
        });

        // Somebody left the chat
        socket.on('disconnect', function () {
            // Notify the other person in the chat room
            // that his partner has left
            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room:    this.room,
                user:    this.username,
                avatar:  this.avatar
            });

            // leave the room
            socket.leave(socket.room);
        });

        // Handle the sending of messages
        socket.on('msg', function (data) {
            // When the server receives a message, it sends it to the other person in the room.
            socket.broadcast.to(socket.room).emit('receive', {
                msg:  data.msg,
                user: data.user,
                img:  data.img
            });
        });
    });
};

function findClientsSocket(io, roomId, namespace) {
    var res = [],
        nsps = io.of(namespace || '/');

    if (nsps) {
        for (var id in nsps.connected) {
            if (roomId) {
                var key   = Object.values(nsps.connected[id].rooms),
                    index = key.indexOf(roomId);

                if (index !== -1) {
                    res.push(nsps.connected[id]);
                }
            } else {
                res.push(nsps.connected[id]);
            }
        }
    }

    return res;
}