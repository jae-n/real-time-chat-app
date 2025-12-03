// server.js 

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// static file current directory
app.use(express.static(__dirname));

// main route defult
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app.html');
});

// track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // user joined
    socket.on('user-joined', (username) => {
        onlineUsers.set(socket.id, username);
        console.log(`${username} joined (${onlineUsers.size} online)`);

        // nofity new user 
        io.emit('user-joined', {
            socketId: socket.id,
            username: username
        });

        // current num of online users
        const users = Array.from(onlineUsers.entries()).map(([socketId, username]) => ({
            socketId,
            username
        }));
        socket.emit('online-users', users);
    });

    // chat message
    socket.on('chat message', (data) => {
        console.log(`${data.user}: ${data.message}`);
        
        // all users receive message
        io.emit('chat message', {
            user: data.user,
            message: data.message,
            timestamp: data.timestamp || new Date()
        });
    });

    // user disconnecting notify
    socket.on('user-leaving', (username) => {
        handleUserDisconnect(socket.id);
    });

    // user disconnected
    socket.on('disconnect', () => {
        handleUserDisconnect(socket.id);
    });
});

function handleUserDisconnect(socketId) {
    const username = onlineUsers.get(socketId);
    
    if (username) {
        onlineUsers.delete(socketId);
        console.log(`${username} left (${onlineUsers.size} online)`);
        
        // notify user left
        io.emit('user-left', {
            socketId: socketId,
            username: username
        });
    }
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(` Campfire server is blazing on http://localhost:${PORT}`);
});