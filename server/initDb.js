import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import seedDatabase from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize the database with schema
 */
export function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');
        
        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split SQL statements and execute them
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
        
        statements.forEach(statement => {
            db.exec(statement);
        });
        
        console.log('✅ Database initialized successfully');
        
        // Verify tables exist
        verifyTables();
        
        // Seed with sample data
        seedDatabase();
        
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
}

/**
 * Verify all required tables exist
 */
function verifyTables() {
    const requiredTables = ['user', 'bus', 'destination', 'booking'];
    const existingTables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all()
        .map(row => row.name);
    
    requiredTables.forEach(table => {
        if (existingTables.includes(table)) {
            console.log(`  ✓ Table '${table}' exists`);
        } else {
            console.error(`  ✗ Table '${table}' missing!`);
        }
    });
}

/**
 * Check database connection health
 */
export function checkDatabaseHealth() {
    try {
        // Simple query to verify connection
        const result = db.prepare('SELECT 1 as health').get();
        return {
            status: 'healthy',
            connected: true,
            message: 'Database connection is working'
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            connected: false,
            message: error.message
        };
    }
}

/**
 * Get database statistics
 */
export function getDatabaseStats() {
    try {
        const tables = db
            .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            .all()
            .map(row => row.name);
        
        const stats = {};
        tables.forEach(table => {
            const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
            stats[table] = count.count;
        });
        
        return {
            tables,
            counts: stats,
            totalTables: tables.length
        };
    } catch (error) {
        console.error('Error getting database stats:', error);
        return { error: error.message };
    }
}

export default { initializeDatabase, checkDatabaseHealth, getDatabaseStats };
