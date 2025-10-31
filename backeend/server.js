    const express = require('express');
    const http = require('http');
    const socketIo = require('socket.io');

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html'); // Serve your client-side HTML
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg); // Broadcast message to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });