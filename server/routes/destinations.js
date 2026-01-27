import express from 'express';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all destinations
router.get('/', authenticateToken, (req, res) => {
    try {
        const destinations = db.prepare('SELECT * FROM destination').all();
        res.json(destinations);
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Get single destination
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const destination = db.prepare('SELECT * FROM destination WHERE id = ?').get(req.params.id);

        if (!destination) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        res.json(destination);
    } catch (error) {
        console.error('Get destination error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Create destination (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name, price, distance } = req.body;

        if (!name || price === undefined || distance === undefined) {
            return res.status(400).json({ error: 'Name, price, and distance are required.' });
        }

        // Check if destination name exists
        const existing = db.prepare('SELECT id FROM destination WHERE name = ?').get(name);
        if (existing) {
            return res.status(400).json({ error: 'Destination name already exists.' });
        }

        const result = db.prepare('INSERT INTO destination (name, price, distance) VALUES (?, ?, ?)')
            .run(name, price, distance);

        res.status(201).json({ message: 'Destination added successfully.', destinationId: result.lastInsertRowid });
    } catch (error) {
        console.error('Create destination error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Update destination (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name, price, distance } = req.body;
        const destId = req.params.id;

        const dest = db.prepare('SELECT * FROM destination WHERE id = ?').get(destId);
        if (!dest) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        db.prepare('UPDATE destination SET name = ?, price = ?, distance = ? WHERE id = ?')
            .run(name || dest.name, price !== undefined ? price : dest.price, distance !== undefined ? distance : dest.distance, destId);

        res.json({ message: 'Destination updated successfully.' });
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Delete destination (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const destId = req.params.id;

        // Check if destination is used in bookings
        const booking = db.prepare('SELECT booking_id FROM booking WHERE destination_id = ?').get(destId);
        if (booking) {
            return res.status(400).json({ error: 'Cannot delete destination as it is currently in use in bookings.' });
        }

        const result = db.prepare('DELETE FROM destination WHERE id = ?').run(destId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        res.json({ message: 'Destination deleted successfully.' });
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;
