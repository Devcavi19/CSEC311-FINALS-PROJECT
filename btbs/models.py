from btbs import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)  # Increased length for bcrypt hashes
    balance = db.Column(db.DECIMAL(10, 2), default=1000.00)  # Use DECIMAL for currency
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
class Bus(db.Model):
    __tablename__ = 'bus'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    capacity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Bus {self.name}>'
    
class Destination(db.Model):
    __tablename__ = 'destination'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    price = db.Column(db.DECIMAL(10, 2), nullable=False)  # Use DECIMAL for currency
    distance = db.Column(db.DECIMAL(8, 2), nullable=False)  # Use DECIMAL for distance
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Destination {self.name}>'
    
class Booking(db.Model):
    __tablename__ = 'booking'
    
    booking_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destination.id'), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    travel_date = db.Column(db.Date, nullable=False)  # Changed to Date for better compatibility
    
    # Relationships with explicit foreign keys
    user = db.relationship('User', backref=db.backref('bookings', lazy=True, cascade='all, delete-orphan'))
    bus = db.relationship('Bus', backref=db.backref('bookings', lazy=True))
    destination = db.relationship('Destination', backref=db.backref('bookings', lazy=True))
    
    def __repr__(self):
        return f'<Booking {self.booking_id}>'