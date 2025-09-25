from btbs import app, db
import os

# Initialize database on first run
if os.getenv('FLASK_ENV') == 'production':
    with app.app_context():
        db.create_all()

# For Vercel deployment
application = app

if __name__ == '__main__':
    app.run(debug=False if os.getenv('FLASK_ENV') == 'production' else True)