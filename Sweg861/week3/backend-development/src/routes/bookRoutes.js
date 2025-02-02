const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/fetch', bookController.fetchAndStoreBooks);
router.get('/', bookController.getAllBooks);
router.get('/:number', bookController.getBook);
router.put('/:number', bookController.updateBook);
router.delete('/:number', bookController.deleteBook);

module.exports = router;
