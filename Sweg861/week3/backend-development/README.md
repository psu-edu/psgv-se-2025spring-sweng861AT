# Harry Potter Books API

A RESTful API that fetches Harry Potter book data, stores it in SQLite, and provides CRUD operations.

## Features
- Fetch and store book data from Harry Potter API
- CRUD operations for book management
- Data validation
- API documentation (Swagger)
- Error handling and basic security

## Tech Stack
Node.js, Express, SQLite3, Axios, Joi, Swagger UI

## Quick Start
1. Clone: `git clone https://github.com/psu-edu/psgv-se-2025spring-sweng861AT.git`
2. cd `/Sweg861/week3/backend-development`
3. Install: `npm install`
4. Run: `npm start`

## API Endpoints
- `POST /api/books/fetch`: Fetch and store books in sqlite database
- `GET /api/books`: Get all books
- `GET /api/books/:number`: Get book by number
- `PUT /api/books/:number`: Update book
- `DELETE /api/books/:number`: Delete book
