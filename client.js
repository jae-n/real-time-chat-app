// client.js for  main.html
//main page

const socket = io('http://localhost:3000');
// store  online users with  socket ID
let username = localStorage.getItem('username') || 'Guest';
let onlineUsers = new Map(); 

// get dom element
let messagesContainer, messageInput, sendBtn, conversationsList, onlineCount;
let currentUserName, currentUserAvatar;

document.addEventListener('DOMContentLoaded', () => {
  // get the doc element 
  messagesContainer = document.getElementById('messagesContainer');
  messageInput = document.getElementById('messageInput');
  sendBtn = document.getElementById('sendBtn');
  conversationsList = document.getElementById('conversationsList');
  onlineCount = document.getElementById('onlineCount');
  currentUserName = document.getElementById('currentUserName');
  currentUserAvatar = document.getElementById('currentUserAvatar');

  // set  user info
  if (currentUserName) currentUserName.textContent = username;
  if (currentUserAvatar) {
    currentUserAvatar.textContent = username.charAt(0).toUpperCase();
  }

  // input for chat enabled
  if (messageInput) messageInput.disabled = false;
  if (sendBtn) sendBtn.disabled = false;

  // group chat info
  const activeChatName = document.getElementById('activeChatName');
  const activeChatAvatar = document.getElementById('activeChatAvatar');
  const activeChatStatus = document.getElementById('activeChatStatus');
  
  if (activeChatName) activeChatName.textContent = 'Campfire Chat';
  if (activeChatAvatar) activeChatAvatar.textContent = '🔥';
  if (activeChatStatus) activeChatStatus.textContent = 'Everyone is here';

  // empty state for messages
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
  }

  // send message button
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      sendMessage();
    });
  }

  //shift for new line, enter to send
  if (messageInput) {
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // auto resize text
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto';
      messageInput.style.height = messageInput.scrollHeight + 'px';
    });
  }
});

// socket connection
socket.on('connect', () => {
  console.log(' Connected to campfire!');
  socket.emit('user-joined', username);
});

socket.on('disconnect', () => {
  console.log('Disconnected from campfire');
});

// listen  for messages
socket.on('chat message', (data) => {
  displayMessage(data);
});

// listen for user joined
socket.on('user-joined', (data) => {
  onlineUsers.set(data.socketId, data.username);
  updateOnlineUsers();
  displaySystemMessage(`${data.username} joined the campfire `);
});

// listen for user left
socket.on('user-left', (data) => {
  onlineUsers.delete(data.socketId);
  updateOnlineUsers();
  displaySystemMessage(`${data.username} left the campfire`);
});

// listen to num of online users
socket.on('online-users', (users) => {
  onlineUsers.clear();
  users.forEach(user => {
    onlineUsers.set(user.socketId, user.username);
  });
  updateOnlineUsers();
});

// send message function
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

// display regular message
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


// display system message
function displaySystemMessage(text) {
  if (!messagesContainer) return;

  const systemDiv = document.createElement('div');
  systemDiv.className = 'system-message';
  systemDiv.innerHTML = `<em>${escapeHtml(text)}</em>`;
  
  messagesContainer.appendChild(systemDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// update num ofonline users 
function updateOnlineUsers() {
  if (!conversationsList || !onlineCount) return;

  //  count update
  onlineCount.textContent = onlineUsers.size;

  // clear list
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

  // add each user
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
//helper function
// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// send nofication on user leaving
window.addEventListener('beforeunload', () => {
  socket.emit('user-leaving', username);
});