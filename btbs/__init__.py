from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration for cloud SQL
if os.getenv('DATABASE_URL'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
else:
    # Fallback for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///busTicketBooking.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')
app.config['WTF_CSRF_TIME_LIMIT'] = None  # Disable CSRF timeout for serverless

# Remove SQLite-specific configurations for cloud deployment
if not app.config['SQLALCHEMY_DATABASE_URI'].startswith('sqlite'):
    app.config.pop('SQLALCHEMY_ENGINE_OPTIONS', None)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Configure limiter for serverless environment
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"  # Use memory storage for serverless
)

# Configure logging for production
if os.getenv('FLASK_ENV') == 'production':
    logging.basicConfig(level=logging.INFO)
else:
    logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)

from btbs import routes