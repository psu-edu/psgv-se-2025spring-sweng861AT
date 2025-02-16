const Book = require('../models/bookModel');
const { fetchBooks } = require('../services/potterApiService');
const { validateBookUpdateData } = require('../utils/dataValidator');

exports.fetchAndStoreBooks = async (req, res) => {
  try {
    const books = await fetchBooks();

    const savedBooks = await Promise.all(books.map(async (book) => {
      try {
        const { error } = validateBookUpdateData(book);
        if (error) {
          console.error(`Validation error for book ${book.number}:`, error.details[0].message);
          return null;
        }
        const savedBook = await Book.create(book);
        return savedBook;
      } catch (error) {
        console.error(`Error saving book ${book.number}:`, error);
        return null;
      }
    }));

    const validSavedBooks = savedBooks.filter(book => book !== null);

    res.status(201).json({
      message: `${validSavedBooks.length} books fetched and stored successfully`,
      books: validSavedBooks
    });
  } catch (error) {
    console.error('Error in fetchAndStoreBooks:', error);
    res.status(500).json({ message: 'Error fetching and storing books', error: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.getAll();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.getById(parseInt(req.params.number, 10));
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const number = parseInt(req.params.number, 10);
    const { error, value } = validateBookUpdateData(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedBook = await Book.update(number, value);
    if (updatedBook) {
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    await Book.delete(parseInt(req.params.number, 10));
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
