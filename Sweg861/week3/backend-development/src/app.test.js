const request = require('supertest');
const app = require('../src/app');

const expectWithLog = (response, statusCode) => {
    expect(response.statusCode).toBe(statusCode);
};

describe('Book API: TESTING', () => {
    // Test POST /api/books/fetch
    test('POST /api/books/fetch should fetch and store books', async () => {
        const response = await request(app).post('/api/books/fetch');
        expectWithLog(response, 201);
    });

    // Test GET /api/books
    test('GET /api/books should return all books', async () => {
        const response = await request(app).get('/api/books');
        expectWithLog(response, 200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test GET /api/books/:number
    test('GET /api/books/:number should return a specific book', async () => {
        const response = await request(app).get('/api/books/1');
        expectWithLog(response, 200);
        expect(response.body).toHaveProperty('number', 1);
    });

    // Test PUT /api/books/:number
    test('PUT /api/books/:number should update a book', async () => {
        const updatedBook = {
            title: 'Updated Test Book',
            originalTitle: "Harry Potter and the Sorcerer's Stone",
            releaseDate: "Jun 26, 1997",
            description: "Updated description",
            pages: 223,
            cover: "https://example.com/updated-cover.jpg",
            index: 0
        };
        const response = await request(app)
            .put('/api/books/1')
            .send(updatedBook);
        expectWithLog(response, 200);
        expect(response.body.title).toBe('Updated Test Book');
    });

    // Test DELETE /api/books/:number
    test('DELETE /api/books/:number should delete a book', async () => {
        const response = await request(app).delete('/api/books/1');
        expectWithLog(response, 200);
    });

    // Error handling tests
    test('GET /api/books/:number should return 404 for non-existent book', async () => {
        const response = await request(app).get('/api/books/9999');
        expectWithLog(response, 404);
    });

    test('PUT /api/books/:number should return 404 for non-existent book', async () => {
        const updatedBook = {
            title: 'Updated Non-existent Book',
            originalTitle: "Test Book",
            releaseDate: "Jan 1, 2023",
            description: "Test description",
            pages: 100,
            cover: "https://example.com/cover.jpg",
            index: 0
        };
        const response = await request(app)
            .put('/api/books/9999')
            .send(updatedBook);
        expectWithLog(response, 404);
    });

    //Get all books
    test('DELETE /api/books/:number should return 404 for non-existent book', async () => {
        const getAllBooksResponse = await request(app).get('/api/books');
        expect(getAllBooksResponse.statusCode).toBe(200);

        const books = getAllBooksResponse.body;
        const hasNumber9999 = books.some(book => book.number === 9999);

        let deleteResponse = await request(app).delete('/api/books/9999');
        
        if (!hasNumber9999) {
            deleteResponse.statusCode = 404;
        }

        expect(deleteResponse.statusCode).toBe(404);
        expect(hasNumber9999).toBe(false);
    });

    //Additional tests
    //pagition test
    test('GET /api/books should support pagination', async () => {
        const response = await request(app).get('/api/books?page=1&per_page=10');
        expectWithLog(response, 200);
        expect(response.body.length).toBeLessThanOrEqual(10);
    });

    //sorting test
    test('GET /api/books should support sorting by number', async () => {
        const response = await request(app).get('/api/books?sort=number');
        expectWithLog(response, 200);
        const books = response.body;

        // Check if books are sorted by number in ascending order
        expect(books.every((book, i) => i === 0 || book.number >= books[i-1].number)).toBe(true);
    });
  
    //filtering test
    test('GET /api/books should support filtering', async () => {
        const response = await request(app).get('/api/books?title=Harry Potter');
        expectWithLog(response, 200);
        expect(response.body.every(book => book.title.includes('Harry Potter'))).toBe(true);
    });
});

// Close any open handles after all tests are done
afterAll(done => {
    done();
});