import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, email, balance, is_admin FROM user').all();
        res.json(users.map(u => ({ ...u, is_admin: Boolean(u.is_admin) })));
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Get single user (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const user = db.prepare('SELECT id, username, email, balance, is_admin FROM user WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ ...user, is_admin: Boolean(user.is_admin) });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Create user (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { username, email, password, is_admin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        // Check if username exists
        const existingUser = db.prepare('SELECT id FROM user WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken.' });
        }

        // Check if email exists
        const existingEmail = db.prepare('SELECT id FROM user WHERE email = ?').get(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already taken.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = db.prepare(
            'INSERT INTO user (username, email, password, balance, is_admin) VALUES (?, ?, ?, ?, ?)'
        ).run(username, email, hashedPassword, 1000, is_admin ? 1 : 0);

        res.status(201).json({ message: 'User created successfully.', userId: result.lastInsertRowid });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { username, email, is_admin } = req.body;
        const userId = req.params.id;

        const user = db.prepare('SELECT * FROM user WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        db.prepare('UPDATE user SET username = ?, email = ?, is_admin = ? WHERE id = ?')
            .run(username || user.username, email || user.email, is_admin !== undefined ? (is_admin ? 1 : 0) : user.is_admin, userId);

        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user has bookings
        const bookings = db.prepare('SELECT booking_id FROM booking WHERE user_id = ?').get(userId);
        if (bookings) {
            return res.status(400).json({ error: 'Cannot delete user as they have active bookings.' });
        }

        const result = db.prepare('DELETE FROM user WHERE id = ?').run(userId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;
