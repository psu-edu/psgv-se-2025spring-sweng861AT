const db = require('../config/database');

class Book {
  static create(data) {
    return new Promise((resolve, reject) => {
      const { number, title, originalTitle, releaseDate, description, pages, cover, index } = data;
      db.run(
        'INSERT OR REPLACE INTO books (number, title, originalTitle, releaseDate, description, pages, cover, book_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [number, title, originalTitle, releaseDate, description, pages, cover, index],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ number, ...data });
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM books ORDER BY number', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getById(number) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM books WHERE number = ?', [number], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static update(number, data) {
    return new Promise((resolve, reject) => {
      const { title, originalTitle, releaseDate, description, pages, cover, index } = data;
      db.run(
        'UPDATE books SET title = ?, originalTitle = ?, releaseDate = ?, description = ?, pages = ?, cover = ?, book_index = ? WHERE number = ?',
        [title, originalTitle, releaseDate, description, pages, cover, index, number],
        function(err) {
          if (err) {
            reject(err);
          } else {
            if (this.changes > 0) {
              resolve({ number, ...data, book_index: index });
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }  

  static delete(number) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM books WHERE number = ?', [number], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ number });
        }
      });
    });
  }
}

module.exports = Book;
