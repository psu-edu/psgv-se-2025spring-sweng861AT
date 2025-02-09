# My React App
This is a React application that interacts with two separate Node.js servers.

## Overview
This React application communicates with two separate Node.js servers:

**Authentication Server**: Handles user authentication and authorization.

**Data Server**: Manages data operations and business logic.

## Prerequisites
Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Git

## Running the Servers
Before starting the React app, you need to ensure that both Node.js servers are running.

Both of the servers along with the react app is in the same git repo:
git clone https://github.com/psu-edu/psgv-se-2025spring-sweng861AT.git


1. Start the Authentication Server:

Navigate to the authentication server folder: cd Sweg861/social-login-app/

Install dependencies: npm install

Start the server: npm start

README.md page for authentication server: https://github.com/psu-edu/psgv-se-2025spring-sweng861AT/blob/main/Sweg861/social-login-app/public/README.md


2. Start the Data Server:
   
Navigate to the data server for harry potter book APIs: cd Sweg861/week3/backend-development/

Install dependencies: npm install

Start the server: npm start

README.md page for data server: https://github.com/psu-edu/psgv-se-2025spring-sweng861AT/blob/main/Sweg861/week3/backend-development/README.md

Make sure both servers are running on their respective ports (8080 for Auth Server and 8000 for Data Server).


3. Start the React development server:
   
Navigate to the react folder: cd Sweg861/week4/social-media-crud-app/

Install dependencies: npm install

Start the server: npm start


4. Open your browser and visit `http://localhost:3000`

## API Documentation
### Authentication Server

- **Base URL**: `http://localhost:8080`
- **Endpoints**:
    - `POST /auth/google`: User login through google authentication
    - `POST /register`: User registration
    - `POST /logout`: logs out the user and creates a logout time
    - `GET /user`: Get user information
    - `GET /check-email`: Check if email exists
    - `GET /admin/users`: Get all the users from the database

### Data Server

- **Base URL**: `http://localhost:8000`
- **Endpoints**:
    - `POST /api/books/fetch`: Fetch and store book data from Potter API
    - `GET /api/books`: Get all books
    - `GET /api/books/{number}`: Get book by number
    - `PUT /api/books/{number}`: Update book data
    - `DELETE /api/books/{number}`: Delete book
