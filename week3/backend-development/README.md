# Harry Potter Books API

A RESTful API that fetches Harry Potter book data, stores it in SQLite, and provides CRUD operations.

## Features
- Fetch and store book data from Harry Potter API
- CRUD operations for book management
- Data validation
- API documentation (Swagger)
- Error handling and basic security
- Unit testing

## Tech Stack
Node.js, Express, SQLite3, Axios, Joi, Swagger UI, Jest, Supertest

## Quick Start
1. Clone: `git clone https://github.com/yourusername/harry-potter-books-api.git`
2. Install: `npm install`
3. Run: `npm start`
4. Test: `npm test`

## API Endpoints
- `POST /api/books/fetch`: Fetch and store books
- `GET /api/books`: Get all books
- `GET /api/books/:number`: Get book by number
- `PUT /api/books/:number`: Update book
- `DELETE /api/books/:number`: Delete book
