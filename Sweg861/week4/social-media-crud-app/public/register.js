document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    fetch('http://localhost:8080/user', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // User is already logged in, redirect to main page
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Error checking user status:', error));
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('first_name').value + " " + document.getElementById('last_name').value;

    // First, check if the email already exists
    fetch(`http://localhost:8080/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            alert('This email is already registered. Please use a different email or go to Login.');
        } else {
            // If email doesn't exist, proceed with registration
            registerUser(email, name);
        }
    })
    .catch(error => {
        console.error('Error checking email:', error);
        alert('An error occurred while checking email. Please try again.');
    });
});

function registerUser(email, name) {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Registration successful! You can now use the app.');
            window.location.href = '/';
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again.');
    });
}
