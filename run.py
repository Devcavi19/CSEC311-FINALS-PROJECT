from btbs import app, db
import os

# Initialize database tables on first run in production
if os.environ.get('VERCEL'):
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Database initialization error: {e}")

# Vercel expects the WSGI app to be named 'app'
# But we can also export it as 'application' for compatibility
application = app

# Handler for Vercel
def handler(request):
    return app(request)

if __name__ == '__main__':
    # Local development
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)