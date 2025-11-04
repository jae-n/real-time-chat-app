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


//login and save username to localStorage
const signInBtn = document.getElementById('signInBtn');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');

  if (signInBtn && usernameInput) {
    signInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Validate inputs
      if (!username) {
        alert('Please enter your camper name!');
        return;
      }

      if (!password) {
        alert('Please enter your password!');
        return;
      }

      // Save username to localStorage
      localStorage.setItem('username', username);
      
      // Redirect to chat
      window.location.href = 'main.html';
    });

    // Allow Enter key to submit
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        signInBtn.click();
      }
    });

    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        signInBtn.click();
      }
    });
  }
