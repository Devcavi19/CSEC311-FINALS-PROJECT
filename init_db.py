from btbs import app, db
from btbs.models import User, Bus, Destination
from btbs import bcrypt
import os

def init_database():
    """Initialize the database with tables and sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user already exists
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            # Create admin user
            admin_password = bcrypt.generate_password_hash('Admin123@').decode('utf-8')
            admin = User(
                username='admin',
                email='admin@busticket.com',
                password=admin_password,
                is_admin=True,
                balance=0.00
            )
            db.session.add(admin)
            
            # Add sample buses
            buses = [
                Bus(name='Express Bus 001', capacity=45),
                Bus(name='Luxury Coach 002', capacity=32),
                Bus(name='Standard Bus 003', capacity=50),
            ]
            for bus in buses:
                db.session.add(bus)
            
            # Add sample destinations
            destinations = [
                Destination(name='Manila-Baguio', price=450.00, distance=250.5),
                Destination(name='Cebu-Dumaguete', price=320.00, distance=180.2),
                Destination(name='Davao-GenSan', price=280.00, distance=150.8),
            ]
            for destination in destinations:
                db.session.add(destination)
            
            try:
                db.session.commit()
                print("Database initialized successfully with sample data!")
            except Exception as e:
                db.session.rollback()
                print(f"Error initializing database: {e}")
        else:
            print("Database already initialized!")

if __name__ == '__main__':
    init_database()