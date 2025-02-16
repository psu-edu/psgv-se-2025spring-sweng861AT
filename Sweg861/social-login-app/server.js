const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 8080;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:8080', 'http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

// SQLite database setup
const db = new sqlite3.Database('./psuLogin.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      loginTime TEXT,
      logoutTime TEXT
    )`);
  }
});

app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' // Adjust SameSite attribute
  }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const userEmail = payload['email'];
    const userName = payload['name'];
    const loginTime = new Date().toISOString();

    // Store or update user information
    db.run(`INSERT OR REPLACE INTO users (id, email, name, loginTime) VALUES (?, ?, ?, ?)`,
      [userId, userEmail, userName, loginTime],
      (err) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ status: 'error', message: 'Failed to save user data' });
        }
        
        // Set session
        req.session.userId = userId;

        res.json({ status: 'success', email: userEmail, name: userName });
      }
    );
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).json({ status: 'error', message: 'Invalid token' });
  }
});

app.get('/user', (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
      }
      if (row) {
        res.json({ status: 'success', user: { email: row.email, name: row.name } });
      } else {
        res.status(401).json({ status: 'error', message: 'Not authenticated' });
      }
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Not authenticated' });
  }
});

app.post('/logout', (req, res) => {
  const userId = req.session.userId;
  const logoutTime = new Date().toISOString();

  if (userId) {
    db.run(`UPDATE users SET logoutTime = ? WHERE id = ?`, [logoutTime, userId], (err) => {
      if (err) {
        console.error('Error updating logout time:', err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ status: 'error', message: 'Failed to logout' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.json({ status: 'success', message: 'Logged out successfully' });
      });
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Not authenticated' });
  }
});

app.get('/admin/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// Endpoint to check if email exists
app.get('/check-email', (req, res) => {
  const { email } = req.query;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ status: 'error', message: 'Database error' });
      }
      res.json({ exists: !!row });
  });
});
// Registration endpoint
app.post('/register', (req, res) => {
  const { email, name } = req.body;
  const id = Date.now().toString(); // Generate a unique ID
  const loginTime = new Date().toISOString();

  db.run('INSERT INTO users (id, email, name, loginTime) VALUES (?, ?, ?, ?)',
      [id, email, name, loginTime],
      function(err) {
          if (err) {
              console.error('Error saving user:', err);
              return res.status(500).json({ status: 'error', message: 'Failed to save user data' });
          }
          
          // Set session (you'll need to implement session management)
          req.session.userId = id;

          res.json({ status: 'success', user: { id, email, name, loginTime } });
      }
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
