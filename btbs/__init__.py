from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import os
from dotenv import load_dotenv
import pymysql

# Install PyMySQL as MySQLdb for SQLAlchemy compatibility
pymysql.install_as_MySQLdb()

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration for cloud SQL
if os.getenv('DATABASE_URL'):
    # Replace mysql:// with mysql+pymysql:// for PyMySQL driver
    database_url = os.getenv('DATABASE_URL')
    if database_url.startswith('mysql://'):
        database_url = database_url.replace('mysql://', 'mysql+pymysql://')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///busTicketBooking.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')
app.config['WTF_CSRF_TIME_LIMIT'] = None  # Disable CSRF timeout for serverless

# MySQL connection pool settings for better performance
if 'mysql' in app.config['SQLALCHEMY_DATABASE_URI']:
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'connect_args': {
            'connect_timeout': 60,
            'read_timeout': 60,
            'write_timeout': 60,
        }
    }

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Configure limiter for serverless environment
limiter = Limiter(
    key_func=get_remote_address,
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