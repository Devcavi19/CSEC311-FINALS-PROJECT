import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import busesRoutes from './routes/buses.js';
import destinationsRoutes from './routes/destinations.js';
import bookingsRoutes from './routes/bookings.js';
import { initializeDatabase, checkDatabaseHealth, getDatabaseStats } from './initDb.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database before starting server
try {
    initializeDatabase();
} catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Health check - enhanced with database connectivity check
app.get('/api/health', (req, res) => {
    const dbHealth = checkDatabaseHealth();
    const dbStats = getDatabaseStats();
    
    res.json({ 
        status: dbHealth.connected ? 'ok' : 'degraded',
        message: 'Bus Ticket Booking API is running',
        database: dbHealth,
        stats: dbStats,
        timestamp: new Date().toISOString()
    });
});

// Database-only health check
app.get('/api/health/database', (req, res) => {
    const dbHealth = checkDatabaseHealth();
    const dbStats = getDatabaseStats();
    
    if (dbHealth.connected) {
        res.json({
            ...dbHealth,
            stats: dbStats
        });
    } else {
        res.status(503).json(dbHealth);
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚌 Bus Ticket Booking API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💾 Database health: http://localhost:${PORT}/api/health/database`);
});
