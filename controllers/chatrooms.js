var socketioJwt = require('socketio-jwt');
var jwtSecret = 'xxxx';

module.exports = function(io) {
    var app = require('express');
    var router = app.Router();
    var numUsers = 0;

    io.on('connection', socketioJwt.authorize({
      secret: jwtSecret,
      timeout: 15000
    })).on('authenticated', function (socket) {
      console.log('connected & authenticated: ' + socket.decoded_token);
      var addedUser = false;
      // when the client emits 'new message', this listens and executes
      socket.on('new message', function (data) {
        // we tell the client to execute 'new message'

        socket.broadcast.to(socket.room).emit('new message', {
          username: socket.username,
          message: data
        });
      });

      // when the client emits 'add user', this listens and executes
      socket.on('add user', function (username, room) {
        if (addedUser) return;
        // we store the username in the socket session for this client
        socket.username = username;
        socket.room = room;
        console.log("Added user: " + socket.username + ", to room: " + socket.room);
        
        ++numUsers;
        addedUser = true;

        socket.join(socket.room);

        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.to(socket.room).emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      });

      // when the client emits 'typing', we broadcast it to others
      // socket.on('typing', function () {
      //   socket.broadcast.emit('typing', {
      //     username: socket.username
      //   });
      // });

      // when the client emits 'stop typing', we broadcast it to others
      // socket.on('stop typing', function () {
      //   socket.broadcast.emit('stop typing', {
      //     username: socket.username
      //   });
      // });

      // when the user disconnects.. perform this
      socket.on('disconnect', function () {
        if (addedUser) {
          --numUsers;

          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    });


    return router;
}