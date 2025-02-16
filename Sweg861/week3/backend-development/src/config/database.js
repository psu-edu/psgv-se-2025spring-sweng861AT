const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    createTable();
  }
});

function createTable() {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    number INTEGER PRIMARY KEY,
    title TEXT,
    originalTitle TEXT,
    releaseDate TEXT,
    description TEXT,
    pages INTEGER,
    cover TEXT,
    book_index INTEGER
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err);
    }
  });
}

module.exports = db;
