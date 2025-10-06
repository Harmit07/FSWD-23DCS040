# Library Portal - Session Management

A Node.js web application that demonstrates complete session management functionality including user authentication, session tracking, and activity logging.

## Features

✅ **User Authentication**
- Login with email and password
- Session creation on successful login
- Automatic redirect to profile page

✅ **Session Management**
- Store user information (name, email, login time)
- Session timeout (30 minutes)
- Secure session configuration

✅ **Profile Page**
- Display user session information
- Show active session status
- View user activity history

✅ **Logout Functionality**
- Secure session destruction
- Activity logging
- Confirmation dialog

✅ **Activity Tracking**
- Login/logout events stored in MongoDB
- User-specific activity logs
- Timestamps for all activities

## Tech Stack

- **Backend**: Node.js, Express.js
- **Session Management**: express-session
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, Vanilla JavaScript

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection (using MongoDB Atlas)

### Installation

1. Navigate to the project directory:
```bash
cd library_portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and visit: `http://localhost:3000`

## Demo Accounts

Use these credentials to test the application:

| Email | Password |
|-------|----------|
| john@example.com | 1234 |
| alice@example.com | abcd |

## How It Works

### Session Flow

1. **Login Process**:
   - User enters credentials on login page
   - Server validates against predefined user data
   - On success: creates session with user info and login time
   - Logs activity to MongoDB
   - Redirects to profile page

2. **Session Management**:
   - Session data includes: name, email, login time
   - Sessions expire after 30 minutes of inactivity
   - Protected routes require authentication

3. **Profile Page**:
   - Displays session information dynamically
   - Shows user's activity history
   - Provides logout functionality

4. **Logout Process**:
   - Logs logout activity to database
   - Destroys session completely
   - Redirects to login page

### Security Features

- **Authentication middleware**: Protects sensitive routes
- **Session security**: HttpOnly cookies, secure configuration
- **Input validation**: Email format validation, required fields
- **User-specific data**: Activity logs filtered by user

### API Endpoints

- `GET /` - Login page (redirects to profile if logged in)
- `POST /login` - Handle login authentication
- `GET /profile` - Profile page (protected)
- `GET /profile-data` - Get session data (protected)
- `GET /activity` - Get user activity logs (protected)
- `GET /logout` - Destroy session and logout
- `GET /session-status` - Check current session status

## File Structure

```
library_portal/
├── server.js          # Main server file
├── package.json       # Dependencies
├── public/
│   └── style.css     # Styling
├── views/
│   ├── login.html    # Login page
│   └── profile.html  # Profile page
└── README.md         # Documentation
```

## Session Configuration

```javascript
session({
  secret: "library_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 60 * 1000, // 30 minutes
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
})
```

## Database Schema

**Activity Collection**:
```javascript
{
  email: String,    // User email
  action: String,   // "login" or "logout"
  time: String     // Timestamp
}
```

## Testing the Application

1. **Login Test**:
   - Visit http://localhost:3000
   - Use demo credentials
   - Verify redirect to profile page

2. **Session Test**:
   - Check profile page shows correct user info
   - Verify login time is displayed
   - Test activity log functionality

3. **Logout Test**:
   - Click logout button
   - Confirm logout dialog
   - Verify redirect to login page
   - Try accessing profile page (should redirect to login)

## Production Considerations

For production deployment, consider:

- Use environment variables for secrets
- Enable HTTPS and set `secure: true` for cookies
- Implement rate limiting for login attempts
- Add password hashing for user accounts
- Use a session store (Redis/MongoDB) instead of memory
- Add CSRF protection
- Implement proper error handling and logging

## Contributing

This is a demonstration project for learning session management concepts in web applications.