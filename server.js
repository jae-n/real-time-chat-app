// server.js - Enhanced with user tracking

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve main.html as default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app.html');
});

// Track online users: Map<socketId, username>
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle user joined
    socket.on('user-joined', (username) => {
        onlineUsers.set(socket.id, username);
        console.log(`${username} joined (${onlineUsers.size} online)`);

        // Notify everyone about new user
        io.emit('user-joined', {
            socketId: socket.id,
            username: username
        });

        // Send current online users to the new user
        const users = Array.from(onlineUsers.entries()).map(([socketId, username]) => ({
            socketId,
            username
        }));
        socket.emit('online-users', users);
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        console.log(`${data.user}: ${data.message}`);
        
        // Broadcast to all clients
        io.emit('chat message', {
            user: data.user,
            message: data.message,
            timestamp: data.timestamp || new Date()
        });
    });

    // Handle user leaving
    socket.on('user-leaving', (username) => {
        handleUserDisconnect(socket.id);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        handleUserDisconnect(socket.id);
    });
});

function handleUserDisconnect(socketId) {
    const username = onlineUsers.get(socketId);
    
    if (username) {
        onlineUsers.delete(socketId);
        console.log(`${username} left (${onlineUsers.size} online)`);
        
        // Notify everyone
        io.emit('user-left', {
            socketId: socketId,
            username: username
        });
    }
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🔥 Campfire server is blazing on http://localhost:${PORT}`);
});