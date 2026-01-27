import db from './db.js';

// Make first user an admin
const user = db.prepare('SELECT * FROM user WHERE id = 1').get();

if (!user) {
    console.log('❌ No user with ID 1 found');
    process.exit(1);
}

console.log(`Making ${user.username} an admin...`);
db.prepare('UPDATE user SET is_admin = 1 WHERE id = 1').run();
console.log(`✅ ${user.username} is now an admin`);

process.exit(0);
