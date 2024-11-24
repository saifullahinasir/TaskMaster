const signUpButton = document.getElementById('sign-up-btn');
const signInButton = document.getElementById('sign-in-btn');
const container = document.querySelector('.container');

// Toggle between sign up and sign in forms
signUpButton.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
});

// Handle user registration
document.querySelector('.sign-up-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            window.location.href = '/dashboard.html';
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});

// Handle user login
document.querySelector('.sign-in-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginData = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html';
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});
