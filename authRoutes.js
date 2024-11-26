const express = require('express');
const router = express.Router();

// Example users array (replace with a database in production)
const users = [];

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation (add better validation in production)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Simulate user creation
    users.push({ username, email, password });
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simulate user authentication
    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Simulate token generation
    const token = `fake-jwt-token-for-${username}`;
    res.status(200).json({ token });
});

module.exports = router;
