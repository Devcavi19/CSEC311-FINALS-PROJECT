import express from 'express';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (admin) or user's bookings
router.get('/', authenticateToken, (req, res) => {
    try {
        let bookings;

        if (req.user.is_admin) {
            // Admin sees all bookings with user, bus, and destination info
            bookings = db.prepare(`
        SELECT 
          b.booking_id,
          b.user_id,
          b.bus_id,
          b.destination_id,
          b.booking_date,
          b.travel_date,
          u.username,
          bus.name as bus_name,
          d.name as destination_name,
          d.price as destination_price
        FROM booking b
        JOIN user u ON b.user_id = u.id
        JOIN bus ON b.bus_id = bus.id
        JOIN destination d ON b.destination_id = d.id
        ORDER BY b.booking_date DESC
      `).all();
        } else {
            // Regular user sees only their bookings
            bookings = db.prepare(`
        SELECT 
          b.booking_id,
          b.user_id,
          b.bus_id,
          b.destination_id,
          b.booking_date,
          b.travel_date,
          bus.name as bus_name,
          bus.capacity as bus_capacity,
          d.name as destination_name,
          d.price as destination_price,
          d.distance as destination_distance
        FROM booking b
        JOIN bus ON b.bus_id = bus.id
        JOIN destination d ON b.destination_id = d.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
      `).all(req.user.id);
        }

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Get single booking
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const booking = db.prepare(`
      SELECT 
        b.*,
        u.username,
        bus.name as bus_name,
        d.name as destination_name
      FROM booking b
      JOIN user u ON b.user_id = u.id
      JOIN bus ON b.bus_id = bus.id
      JOIN destination d ON b.destination_id = d.id
      WHERE b.booking_id = ?
    `).get(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        // Regular users can only see their own bookings
        if (!req.user.is_admin && booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Create booking
router.post('/', authenticateToken, (req, res) => {
    try {
        const { bus_id, destination_id, travel_date } = req.body;

        if (!bus_id || !destination_id || !travel_date) {
            return res.status(400).json({ error: 'Bus, destination, and travel date are required.' });
        }

        // Verify bus exists
        const bus = db.prepare('SELECT id FROM bus WHERE id = ?').get(bus_id);
        if (!bus) {
            return res.status(400).json({ error: 'Invalid bus selected.' });
        }

        // Verify destination exists
        const destination = db.prepare('SELECT id FROM destination WHERE id = ?').get(destination_id);
        if (!destination) {
            return res.status(400).json({ error: 'Invalid destination selected.' });
        }

        const booking_date = new Date().toISOString();

        const result = db.prepare(`
      INSERT INTO booking (user_id, bus_id, destination_id, booking_date, travel_date) 
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, bus_id, destination_id, booking_date, travel_date);

        res.status(201).json({
            message: 'Ticket booked successfully.',
            bookingId: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'An error occurred during booking.' });
    }
});

// Update booking (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { bus_id, destination_id, travel_date } = req.body;
        const bookingId = req.params.id;

        const booking = db.prepare('SELECT * FROM booking WHERE booking_id = ?').get(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        db.prepare('UPDATE booking SET bus_id = ?, destination_id = ?, travel_date = ? WHERE booking_id = ?')
            .run(
                bus_id || booking.bus_id,
                destination_id || booking.destination_id,
                travel_date || booking.travel_date,
                bookingId
            );

        res.json({ message: 'Booking updated successfully.' });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

// Cancel/delete booking
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = db.prepare('SELECT * FROM booking WHERE booking_id = ?').get(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        // Regular users can only cancel their own bookings
        if (!req.user.is_admin && booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to cancel this booking.' });
        }

        db.prepare('DELETE FROM booking WHERE booking_id = ?').run(bookingId);

        res.json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

export default router;
