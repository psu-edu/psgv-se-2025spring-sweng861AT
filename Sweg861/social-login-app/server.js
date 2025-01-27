const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// SQLite database setup
const db = new sqlite3.Database('./psuLogin.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
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
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
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
          res.status(500).json({ status: 'error', message: 'Failed to logout' });
        } else {
          res.json({ status: 'success', message: 'Logged out successfully' });
        }
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
