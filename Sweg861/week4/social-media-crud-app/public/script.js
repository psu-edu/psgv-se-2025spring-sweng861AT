function handleCredentialResponse(response) {    
    fetch('http://localhost:8080/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: response.credential}),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('book-manager').style.display = 'block';
            document.getElementById('user-name').textContent = `Name: ${data.name}`;
            document.getElementById('user-email').textContent = `Email: ${data.email}`;
        } else {
            console.error('Login failed:', data.message);
            alert('Login failed. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function handleLogout() {
    fetch('http://localhost:8080/logout', { 
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('login-container').style.display = 'flex';
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('book-manager').style.display = 'none';
            document.getElementById('user-name').textContent = '';
            document.getElementById('user-email').textContent = '';
            document.getElementById('content-display').innerHTML = '';
            books = [];
        } else {
            console.error('Logout failed:', data.message);
            alert('Logout failed. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    });
}

function fetchAndStoreBooks() {
    fetch('http://localhost:8000/api/books/fetch', { 
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        alert('Books fetched and stored successfully!');
        document.getElementById('content-display').innerHTML = '<p>Books have been fetched and stored. Click "Get All Books" to view them.</p>';
    })
    .catch(error => {
        console.error('Error fetching and storing books:', error);
        alert('Failed to fetch and store books. Please try again.');
    });
}

function getAllBooks() {
    fetch('http://localhost:8000/api/books', { credentials: 'include' })
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            alert('Failed to fetch books. Please try again.');
        });
}

function getBook() {
    const number = prompt("Enter book number:");
    if (number) {
        fetch(`http://localhost:8000/api/books/${number}`, { credentials: 'include' })
            .then(response => response.json())
            .then(book => {
                if (book) {
                    displayBookDetails(book);
                } else {
                    alert('Book not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching book:', error);
                alert('Failed to fetch book details. Please try again.');
            });
    }
}

function updateBook() {
    const number = prompt("Enter book number to update:");
    if (number) {
        fetch(`http://localhost:8000/api/books/${number}`, { credentials: 'include' })
            .then(response => response.json())
            .then(book => {
                if (book) {
                    showUpdateForm(book);
                } else {
                    alert('Book not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching book:', error);
                alert('Failed to fetch book details. Please try again.');
            });
    }
}


function deleteBook() {
    const number = prompt("Enter book number to delete:");
    if (number) {
        fetch(`http://localhost:8000/api/books/${number}`, { 
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            alert('Book deleted successfully!');
            getAllBooks();
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            alert('Failed to delete book. Please try again.');
        });
    }
}

function displayBooks(books) {
    const contentDisplay = document.getElementById('content-display');
    let content = '<h3>Book List:</h3>';
    books.forEach(book => {
        content += `
            <div>
                Book Number: ${book.number}<br>
                Book Title: ${book.title}<br>
                Release Date: ${book.releaseDate}<br><br>
            </div>
        `;
    });
    contentDisplay.innerHTML = content;
}

function displayBookDetails(book) {
    const contentDisplay = document.getElementById('content-display');
    contentDisplay.innerHTML = `
        <h3>Book Details:</h3>
        <p><strong>Book Number:</strong> ${book.number}</p>
        <p><strong>Index:</strong> ${book.number - 1}</p>
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Original Title:</strong> ${book.originalTitle}</p>
        <p><strong>Release Date:</strong> ${book.releaseDate}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <p><strong>Cover:</strong> <img src="${book.cover}" alt="Book cover" style="max-width: 200px;"></p>
    `;
}

function showUpdateForm(book) {
    const contentDisplay = document.getElementById('content-display');
    contentDisplay.innerHTML = `
        <h3>Update Book</h3>
        <form id="update-book-form">
            <label for="title">Title:</label>
            <input type="text" id="title" value="${book.title}" required><br>

            <label for="originalTitle">Original Title:</label>
            <input type="text" id="originalTitle" value="${book.originalTitle}" required><br>

            <label for="releaseDate">Release Date:</label>
            <input type="text" id="releaseDate" value="${book.releaseDate}" required><br>

            <label for="description">Description:</label>
            <textarea id="description" required>${book.description}</textarea><br>

            <label for="pages">Pages:</label>
            <input type="number" id="pages" value="${book.pages}" required><br>

            <label for="cover">Cover URL:</label>
            <input type="url" id="cover" value="${book.cover}" required><br>

            <input type="hidden" id="number" value="${book.number}">

            <button type="submit">Update Book</button>
        </form>
    `;
    document.getElementById('update-book-form').onsubmit = (e) => {
        e.preventDefault();
        const number = parseInt(document.getElementById('number').value);
        const updatedData = {
            title: document.getElementById('title').value,
            originalTitle: document.getElementById('originalTitle').value,
            releaseDate: document.getElementById('releaseDate').value,
            description: document.getElementById('description').value,
            pages: parseInt(document.getElementById('pages').value),
            cover: document.getElementById('cover').value,
            index: number - 1
        };
        submitUpdate(number, updatedData);
    };
}

function submitUpdate(number, updatedData) {
    fetch(`http://localhost:8000/api/books/${number}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(updatedBook => {
        alert('Book updated successfully!');
        fetch(`http://localhost:8000/api/books/${number}`, { credentials: 'include' })
            .then(response => response.json())
            .then(book => {
                if (book) {
                    displayBookDetails(book);
                } else {
                    alert('Book not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching book:', error);
                alert('Failed to fetch book details. Please try again.');
            });
    })
    .catch(error => {
        console.error('Error updating book:', error);
        alert('Failed to update book. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('fetch-books').addEventListener('click', fetchAndStoreBooks);
    document.getElementById('get-all-books').addEventListener('click', getAllBooks);
    document.getElementById('get-book').addEventListener('click', getBook);
    document.getElementById('update-book').addEventListener('click', updateBook);
    document.getElementById('delete-book').addEventListener('click', deleteBook);

    fetch('http://localhost:8080/user', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('book-manager').style.display = 'block';
                document.getElementById('user-name').textContent = `Name: ${data.user.name}`;
                document.getElementById('user-email').textContent = `Email: ${data.user.email}`;
            }
        })
        .catch(error => console.error('Error checking user status:', error));
});
