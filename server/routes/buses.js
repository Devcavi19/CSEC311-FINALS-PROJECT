import express from 'express';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all buses
router.get('/', authenticateToken, (req, res) => {
    try {
        const buses = db.prepare('SELECT * FROM bus').all();
        res.json(buses);
    } catch (error) {
        console.error('Get buses error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Get single bus
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const bus = db.prepare('SELECT * FROM bus WHERE id = ?').get(req.params.id);

        if (!bus) {
            return res.status(404).json({ error: 'Bus not found.' });
        }

        res.json(bus);
    } catch (error) {
        console.error('Get bus error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Create bus (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name, capacity } = req.body;

        if (!name || !capacity) {
            return res.status(400).json({ error: 'Name and capacity are required.' });
        }

        // Check if bus name exists
        const existingBus = db.prepare('SELECT id FROM bus WHERE name = ?').get(name);
        if (existingBus) {
            return res.status(400).json({ error: 'Bus name already exists.' });
        }

        const result = db.prepare('INSERT INTO bus (name, capacity) VALUES (?, ?)').run(name, capacity);

        res.status(201).json({ message: 'Bus added successfully.', busId: result.lastInsertRowid });
    } catch (error) {
        console.error('Create bus error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Update bus (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name, capacity } = req.body;
        const busId = req.params.id;

        const bus = db.prepare('SELECT * FROM bus WHERE id = ?').get(busId);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found.' });
        }

        db.prepare('UPDATE bus SET name = ?, capacity = ? WHERE id = ?')
            .run(name || bus.name, capacity || bus.capacity, busId);

        res.json({ message: 'Bus updated successfully.' });
    } catch (error) {
        console.error('Update bus error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Delete bus (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const busId = req.params.id;

        // Check if bus is used in bookings
        const booking = db.prepare('SELECT booking_id FROM booking WHERE bus_id = ?').get(busId);
        if (booking) {
            return res.status(400).json({ error: 'Cannot delete bus as it is currently in use in bookings.' });
        }

        const result = db.prepare('DELETE FROM bus WHERE id = ?').run(busId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Bus not found.' });
        }

        res.json({ message: 'Bus deleted successfully.' });
    } catch (error) {
        console.error('Delete bus error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;
