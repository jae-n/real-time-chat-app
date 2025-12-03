// generate  stars
//background stars
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


//get doc elements
const signInBtn = document.getElementById('signInBtn');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
// note better authentication needed for production
//jwt 

// login check
if (localStorage.getItem('username')) {
  window.location.href = 'main.html';
}

//sign in button
signInBtn.addEventListener('click', (e) => {
  e.preventDefault();
// input values
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

  // user data from local storage
  let users = JSON.parse(localStorage.getItem('users')) || [];

  // check if username exists
  const user = users.find(u => u.username === username);

  if (user) {
    // user name exist then password check
    if (user.password === password) {
      localStorage.setItem('username', username);
      window.location.href = 'main.html';
    } else {
      alert('Incorrect password. Please try again.');
    }
  } else {
    // username not found, create new account
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('username', username);
    alert('New account created!');
    window.location.href = 'main.html';
  }
});

// sign in
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      signInBtn.click();
    }
  });
});