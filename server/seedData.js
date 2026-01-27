import bcrypt from 'bcryptjs';
import db from './db.js';

/**
 * Seed the database with sample data
 */
function seedDatabase() {
    console.log('🌱 Seeding database with sample data...');
    
    try {
        // Check if data already exists
        const userCount = db.prepare('SELECT COUNT(*) as count FROM user').get().count;
        if (userCount > 0) {
            console.log('⚠️  Database already contains data. Skipping seed.');
            console.log('   To re-seed, delete busTicketBooking.db and restart the server.');
            return;
        }

        // Create users
        console.log('  Creating users...');
        const hashedAdminPassword = bcrypt.hashSync('admin123', 10);
        const hashedUserPassword = bcrypt.hashSync('user123', 10);
        
        db.prepare('INSERT INTO user (username, email, password, balance, is_admin) VALUES (?, ?, ?, ?, ?)').run(
            'admin', 'admin@busticket.com', hashedAdminPassword, 5000, 1
        );
        
        db.prepare('INSERT INTO user (username, email, password, balance, is_admin) VALUES (?, ?, ?, ?, ?)').run(
            'john_doe', 'john@example.com', hashedUserPassword, 1000, 0
        );
        
        db.prepare('INSERT INTO user (username, email, password, balance, is_admin) VALUES (?, ?, ?, ?, ?)').run(
            'jane_smith', 'jane@example.com', hashedUserPassword, 1500, 0
        );

        // Create destinations
        console.log('  Creating destinations...');
        const destinations = [
            { name: 'New York City', price: 45.00, distance: 250 },
            { name: 'Los Angeles', price: 120.00, distance: 2800 },
            { name: 'Chicago', price: 65.00, distance: 800 },
            { name: 'San Francisco', price: 115.00, distance: 2900 },
            { name: 'Miami', price: 95.00, distance: 1300 },
            { name: 'Seattle', price: 105.00, distance: 2850 },
            { name: 'Boston', price: 50.00, distance: 220 },
            { name: 'Las Vegas', price: 85.00, distance: 2700 }
        ];

        destinations.forEach(dest => {
            db.prepare('INSERT INTO destination (name, price, distance) VALUES (?, ?, ?)').run(
                dest.name, dest.price, dest.distance
            );
        });

        // Create buses
        console.log('  Creating buses...');
        const buses = [
            { name: 'Express 101', capacity: 50 },
            { name: 'Luxury Liner 202', capacity: 40 },
            { name: 'Super Express 303', capacity: 60 },
            { name: 'Comfort Coach 404', capacity: 45 },
            { name: 'Night Rider 505', capacity: 55 },
            { name: 'Economy Plus 606', capacity: 52 }
        ];

        buses.forEach(bus => {
            db.prepare('INSERT INTO bus (name, capacity) VALUES (?, ?)').run(
                bus.name, bus.capacity
            );
        });

        // Create sample bookings
        console.log('  Creating sample bookings...');
        const bookings = [
            { user_id: 2, bus_id: 1, destination_id: 1, travel_date: '2026-02-15T08:00:00Z' },
            { user_id: 2, bus_id: 3, destination_id: 3, travel_date: '2026-02-20T10:00:00Z' },
            { user_id: 3, bus_id: 2, destination_id: 2, travel_date: '2026-02-18T09:00:00Z' },
            { user_id: 3, bus_id: 4, destination_id: 4, travel_date: '2026-03-01T14:00:00Z' }
        ];

        bookings.forEach(booking => {
            db.prepare('INSERT INTO booking (user_id, bus_id, destination_id, booking_date, travel_date) VALUES (?, ?, ?, ?, ?)').run(
                booking.user_id, 
                booking.bus_id, 
                booking.destination_id, 
                new Date().toISOString(),
                booking.travel_date
            );
        });

        console.log('✅ Database seeded successfully!');
        console.log('');
        console.log('📝 Sample accounts:');
        console.log('   Admin: username="admin", password="admin123"');
        console.log('   User1: username="john_doe", password="user123"');
        console.log('   User2: username="jane_smith", password="user123"');
        console.log('');
        console.log('📊 Data created:');
        console.log(`   - ${destinations.length} destinations`);
        console.log(`   - ${buses.length} buses`);
        console.log(`   - 3 users`);
        console.log(`   - ${bookings.length} sample bookings`);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

export default seedDatabase;
