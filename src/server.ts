const express = require('express');
const path = require('path');
const http = require('http');
const socketIO  = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));
server.listen(5002);

let connectedUsers: string[] = [];

io.on('connection', (socket: any) => {
    socket.on('join-request', (username: string) => {
        socket.username = username;
        connectedUsers.push( username );

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });

    socket.on('send-msg', (txt: string) => {
        let obj = {
            username: socket.username,
            message: txt
        };

        socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);
    });
});