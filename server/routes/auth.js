import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = db.prepare('SELECT * FROM user WHERE username = ?').get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                balance: user.balance,
                is_admin: Boolean(user.is_admin)
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Register
router.post('/register', (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Log incoming registration request (without password)
        console.log('📝 Registration attempt:', { username, email });

        if (!username || !email || !password) {
            console.log('❌ Registration failed: Missing required fields');
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        // Validate username format
        if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
            console.log('❌ Registration failed: Invalid username format');
            return res.status(400).json({ error: 'Username contains invalid characters.' });
        }

        // Validate password strength
        if (password.length < 6) {
            console.log('❌ Registration failed: Password too short');
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        // Check if username exists
        const existingUser = db.prepare('SELECT id FROM user WHERE username = ?').get(username);
        if (existingUser) {
            console.log('❌ Registration failed: Username already taken');
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Check if email exists
        const existingEmail = db.prepare('SELECT id FROM user WHERE email = ?').get(email);
        if (existingEmail) {
            console.log('❌ Registration failed: Email already taken');
            return res.status(400).json({ error: 'Email already taken.' });
        }

        // Hash password using bcrypt (compatible with Flask-Bcrypt)
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert new user
        const result = db.prepare(
            'INSERT INTO user (username, email, password, balance, is_admin) VALUES (?, ?, ?, ?, ?)'
        ).run(username, email, hashedPassword, 1000, 0);

        console.log('✅ Registration successful:', { userId: result.lastInsertRowid, username });

        res.status(201).json({
            message: 'Account created successfully.',
            userId: result.lastInsertRowid
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = db.prepare('SELECT id, username, email, balance, is_admin FROM user WHERE id = ?').get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({
            ...user,
            is_admin: Boolean(user.is_admin)
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;
