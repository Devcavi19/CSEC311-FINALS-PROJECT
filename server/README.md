# Bus Ticket Booking API - Backend Server

## Overview

RESTful API backend for the Bus Ticket Booking System built with Node.js, Express, and SQLite.

## Features

- ✅ User authentication (register, login, JWT tokens)
- ✅ Role-based access control (Admin & Regular users)
- ✅ Complete CRUD operations for:
  - Users (Admin only)
  - Buses (Admin management, all users can view)
  - Destinations (Admin management, all users can view)
  - Bookings (Users can create/view their own, Admin can manage all)
- ✅ Automatic database initialization
- ✅ Sample data seeding
- ✅ Health check endpoints
- ✅ Comprehensive error handling
- ✅ CORS configuration for frontend integration

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3 (better-sqlite3)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt.js
- **CORS:** cors middleware

## Project Structure

```
server/
├── index.js           # Main server file, routes registration
├── db.js              # Database connection
├── initDb.js          # Database initialization & health checks
├── seedData.js        # Sample data seeding
├── schema.sql         # Database schema
├── makeAdmin.js       # Utility to make users admin
├── middleware/
│   └── auth.js        # Authentication & authorization middleware
└── routes/
    ├── auth.js        # Authentication endpoints
    ├── users.js       # User management (admin only)
    ├── buses.js       # Bus management
    ├── destinations.js # Destination management
    └── bookings.js    # Booking management
```

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Install Dependencies

```bash
cd server
npm install
```

### Start the Server

```bash
node index.js
```

The server will:

1. Initialize the database (create tables)
2. Seed sample data (first run only)
3. Start listening on port 3001

### Environment Variables (Optional)

Create a `.env` file:

```env
PORT=3001
JWT_SECRET=your-secret-key-here
```

If not provided, defaults will be used.

## Database

### Schema

The database includes 4 main tables:

1. **user** - User accounts with authentication
2. **bus** - Bus information (name, capacity)
3. **destination** - Destinations with pricing and distance
4. **booking** - User bookings linking users, buses, and destinations

### Sample Data (Auto-seeded)

**Users:**

- Admin: `admin` / `admin123` (balance: $5000)
- User 1: `john_doe` / `user123` (balance: $1000)
- User 2: `jane_smith` / `user123` (balance: $1500)

**Destinations:** 8 cities (NYC, LA, Chicago, SF, Miami, Seattle, Boston, Las Vegas)
**Buses:** 6 buses with varying capacities (40-60 seats)
**Bookings:** 4 sample bookings

### Database File

- Location: `server/busTicketBooking.db`
- To reset: Delete the file and restart the server

### Make User Admin

```bash
node makeAdmin.js
```

This makes the first user (ID: 1) an admin.

## API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires token)

### Buses

- `GET /buses` - Get all buses (authenticated)
- `GET /buses/:id` - Get single bus (authenticated)
- `POST /buses` - Create bus (admin only)
- `PUT /buses/:id` - Update bus (admin only)
- `DELETE /buses/:id` - Delete bus (admin only)

### Destinations

- `GET /destinations` - Get all destinations (authenticated)
- `GET /destinations/:id` - Get single destination (authenticated)
- `POST /destinations` - Create destination (admin only)
- `PUT /destinations/:id` - Update destination (admin only)
- `DELETE /destinations/:id` - Delete destination (admin only)

### Bookings

- `GET /bookings` - Get bookings (user: own only, admin: all)
- `GET /bookings/:id` - Get single booking (user: own only, admin: any)
- `POST /bookings` - Create booking (authenticated)
- `PUT /bookings/:id` - Update booking (admin only)
- `DELETE /bookings/:id` - Cancel booking (owner or admin)

### Users (Admin Only)

- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Health Check

- `GET /health` - Server and database health status
- `GET /health/database` - Detailed database statistics

## Authentication

### Request Headers

For authenticated routes, include JWT token:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Tokens expire after 24 hours.

## Error Responses

All errors return JSON:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:

- 200: Success (GET)
- 201: Created (POST)
- 400: Bad Request (validation)
- 401: Unauthorized (auth required/failed)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## CORS Configuration

Configured to accept requests from:

- `http://localhost:5173` (Vite default)

To add more origins, edit `server/index.js`:

```javascript
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
```

## Testing

### Manual Testing

Use curl or tools like Postman, Insomnia, or Thunder Client.

Example:

```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get all buses (with token)
curl http://localhost:3001/api/buses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Database Stats

Check database statistics:

```bash
curl http://localhost:3001/api/health
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Issues

Delete and reinitialize:

```bash
rm busTicketBooking.db
node index.js
```

### Check Logs

Server logs are written to console. For persistent logging:

```bash
node index.js > server.log 2>&1 &
tail -f server.log
```

## Development

### Adding New Routes

1. Create route file in `routes/`
2. Import in `server/index.js`
3. Register with `app.use()`

Example:

```javascript
import newRoutes from "./routes/newRoute.js";
app.use("/api/new", newRoutes);
```

### Modifying Schema

1. Update `schema.sql`
2. Delete `busTicketBooking.db`
3. Restart server

## Production Deployment

### Considerations

- Use environment variables for sensitive data
- Implement rate limiting
- Add request logging (morgan)
- Use HTTPS
- Add input validation/sanitization
- Consider PostgreSQL/MySQL for production
- Implement database migrations
- Add comprehensive testing

### Security

- JWT secrets should be strong and stored securely
- Passwords are hashed with bcrypt (10 rounds)
- SQL injection protection via parameterized queries
- CORS properly configured

## License

ISC

## Support

For issues or questions:

1. Check server logs
2. Verify database exists
3. Test health endpoint
4. Review API documentation in FRONTEND_API_GUIDE.md
