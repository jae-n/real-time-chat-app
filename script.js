// Generate random stars
const starsContainer = document.getElementById('stars');

for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 60 + '%';
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}


// --- Select elements ---
const signInBtn = document.getElementById('signInBtn');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');

// --- Redirect if already logged in ---
if (localStorage.getItem('username')) {
  window.location.href = 'main.html';
}

// --- Sign in button click ---
signInBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) {
    alert('Please enter your camper name!');
    return;
  }

  if (!password) {
    alert('Please enter your password!');
    return;
  }

  // Get users array from localStorage or create empty array
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if username exists
  const user = users.find(u => u.username === username);

  if (user) {
    // Username exists → check password
    if (user.password === password) {
      localStorage.setItem('username', username);
      window.location.href = 'main.html';
    } else {
      alert('Incorrect password. Please try again.');
    }
  } else {
    // Username doesn’t exist → create new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('username', username);
    alert('New account created!');
    window.location.href = 'main.html';
  }
});

// --- Press Enter to sign in ---
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      signInBtn.click();
    }
  });
});