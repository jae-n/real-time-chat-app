// client.js - Complete chat functionality for main.html

const socket = io('http://localhost:3000');

let username = localStorage.getItem('username') || 'Guest';
let onlineUsers = new Map(); // Store online users with their socket IDs

// DOM Elements
let messagesContainer, messageInput, sendBtn, conversationsList, onlineCount;
let currentUserName, currentUserAvatar;

document.addEventListener('DOMContentLoaded', () => {
  // Get all DOM elements
  messagesContainer = document.getElementById('messagesContainer');
  messageInput = document.getElementById('messageInput');
  sendBtn = document.getElementById('sendBtn');
  conversationsList = document.getElementById('conversationsList');
  onlineCount = document.getElementById('onlineCount');
  currentUserName = document.getElementById('currentUserName');
  currentUserAvatar = document.getElementById('currentUserAvatar');

  // Set current user info
  if (currentUserName) currentUserName.textContent = username;
  if (currentUserAvatar) {
    currentUserAvatar.textContent = username.charAt(0).toUpperCase();
  }

  // Enable input and button for group chat
  if (messageInput) messageInput.disabled = false;
  if (sendBtn) sendBtn.disabled = false;

  // Set up group chat header
  const activeChatName = document.getElementById('activeChatName');
  const activeChatAvatar = document.getElementById('activeChatAvatar');
  const activeChatStatus = document.getElementById('activeChatStatus');
  
  if (activeChatName) activeChatName.textContent = 'Campfire Chat';
  if (activeChatAvatar) activeChatAvatar.textContent = '🔥';
  if (activeChatStatus) activeChatStatus.textContent = 'Everyone is here';

  // Clear empty state
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
  }

  // Send message on button click
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      sendMessage();
    });
  }

  // Send message on Enter (Shift+Enter for new line)
  if (messageInput) {
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto';
      messageInput.style.height = messageInput.scrollHeight + 'px';
    });
  }
});

// Socket connection
socket.on('connect', () => {
  console.log(' Connected to campfire!');
  socket.emit('user-joined', username);
});

socket.on('disconnect', () => {
  console.log('Disconnected from campfire');
});

// Listen for chat messages
socket.on('chat message', (data) => {
  displayMessage(data);
});

// Listen for user joined
socket.on('user-joined', (data) => {
  onlineUsers.set(data.socketId, data.username);
  updateOnlineUsers();
  displaySystemMessage(`${data.username} joined the campfire `);
});

// Listen for user left
socket.on('user-left', (data) => {
  onlineUsers.delete(data.socketId);
  updateOnlineUsers();
  displaySystemMessage(`${data.username} left the campfire`);
});

// Listen for online users list
socket.on('online-users', (users) => {
  onlineUsers.clear();
  users.forEach(user => {
    onlineUsers.set(user.socketId, user.username);
  });
  updateOnlineUsers();
});

// Send message function
function sendMessage() {
  const message = messageInput.value.trim();
  
  if (message) {
    socket.emit('chat message', {
      user: username,
      message: message,
      timestamp: new Date()
    });
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
  }
}

// Display regular message
function displayMessage(data) {
  if (!messagesContainer) return;

  const messageDiv = document.createElement('div');
  const isOwnMessage = data.user === username;
  
  messageDiv.className = `message ${isOwnMessage ? 'sent' : 'received'}`;
  
  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  messageDiv.innerHTML = `
    <div class="message-avatar">${data.user.charAt(0).toUpperCase()}</div>
    <div class="message-content">
      <div class="message-header">
        <span class="message-sender">${data.user}</span>
        <span class="message-time">${time}</span>
      </div>
      <div class="message-bubble">${escapeHtml(data.message)}</div>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// Display system message
function displaySystemMessage(text) {
  if (!messagesContainer) return;

  const systemDiv = document.createElement('div');
  systemDiv.className = 'system-message';
  systemDiv.innerHTML = `<em>${escapeHtml(text)}</em>`;
  
  messagesContainer.appendChild(systemDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update online users list
function updateOnlineUsers() {
  if (!conversationsList || !onlineCount) return;

  // Update count
  onlineCount.textContent = onlineUsers.size;

  // Clear list
  conversationsList.innerHTML = '';

  if (onlineUsers.size === 0) {
    conversationsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔥</div>
        <div class="empty-state-text">No campers yet</div>
        <div class="empty-state-subtext">Open another tab to chat with yourself!</div>
      </div>
    `;
    return;
  }

  // Add each user
  onlineUsers.forEach((user, socketId) => {
    const userDiv = document.createElement('div');
    userDiv.className = `conversation ${user === username ? 'active' : ''}`;
    userDiv.innerHTML = `
      <div class="conversation-avatar">${user.charAt(0).toUpperCase()}</div>
      <div class="conversation-info">
        <div class="conversation-name">${escapeHtml(user)}${user === username ? ' (You)' : ''}</div>
        <div class="conversation-last-message">Online</div>
      </div>
    `;
    conversationsList.appendChild(userDiv);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send notification when user leaves
window.addEventListener('beforeunload', () => {
  socket.emit('user-leaving', username);
});