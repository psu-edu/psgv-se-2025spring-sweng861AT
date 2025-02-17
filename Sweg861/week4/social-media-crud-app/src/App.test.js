const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('HTML and JavaScript Files', () => {
  const publicDir = path.join(__dirname, '..', 'public');
  
  describe('index.html', () => {
    let dom;
    let document;
  
    beforeAll(() => {
      const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
      dom = new JSDOM(html);
      document = dom.window.document;
    });
  
    test('has the correct title', () => {
      expect(document.title).toBe('Google SignIn or Register For CRUD App');
    });
  
    test('contains a login container', () => {
      const loginContainer = document.getElementById('login-container');
      expect(loginContainer).not.toBeNull();
    });
  
    test('contains Google Sign-In button', () => {
      const googleSignIn = document.querySelector('.g_id_signin');
      expect(googleSignIn).not.toBeNull();
    });
  
    test('contains a register button', () => {
      const registerButton = document.querySelector('.register-button');
      expect(registerButton).not.toBeNull();
      expect(registerButton.textContent).toBe('Register');
    });
  
    test('contains a user info section', () => {
      const userInfo = document.getElementById('user-info');
      expect(userInfo).not.toBeNull();
    });
  
    test('contains a logout button', () => {
      const logoutButton = document.getElementById('logout-button');
      expect(logoutButton).not.toBeNull();
      expect(logoutButton.textContent).toBe('Logout');
    });
  
    test('contains a book manager section', () => {
      const bookManager = document.getElementById('book-manager');
      expect(bookManager).not.toBeNull();
    });
  
    test('contains book management buttons', () => {
      const fetchBooksButton = document.getElementById('fetch-books');
      const getAllBooksButton = document.getElementById('get-all-books');
      const getBookButton = document.getElementById('get-book');
      const updateBookButton = document.getElementById('update-book');
      const deleteBookButton = document.getElementById('delete-book');
  
      expect(fetchBooksButton).not.toBeNull();
      expect(getAllBooksButton).not.toBeNull();
      expect(getBookButton).not.toBeNull();
      expect(updateBookButton).not.toBeNull();
      expect(deleteBookButton).not.toBeNull();
    });
  
    test('includes the Google Sign-In client script', () => {
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      expect(googleScript).not.toBeNull();
    });
  
    test('includes the script.js file', () => {
      const scriptJs = document.querySelector('script[src="script.js"]');
      expect(scriptJs).not.toBeNull();
    });
  
    test('contains a content display area', () => {
      const contentDisplay = document.getElementById('content-display');
      expect(contentDisplay).not.toBeNull();
    });
  
    test('has correct CSS styles', () => {
      const styles = document.querySelector('style');
      expect(styles).not.toBeNull();
      const styleContent = styles.textContent;
      expect(styleContent).toContain('font-family: Arial, sans-serif');
      expect(styleContent).toContain('background-color: #f0f0f0');
      expect(styleContent).toContain('background-color: #4CAF50');
    });
  });

  describe('register.html', () => {
    let dom;
    beforeAll(() => {
      const html = fs.readFileSync(path.join(publicDir, 'register.html'), 'utf8');
      dom = new JSDOM(html);
      global.document = dom.window.document;
    });
  
    test('has the correct title', () => {
      expect(document.title).toBe('Register for CRUD App');
    });
  
    test('contains a registration form', () => {
      const registrationForm = document.querySelector('#registerForm');
      expect(registrationForm).not.toBeNull();
    });
  
    test('registration form has first name, last name, and email inputs', () => {
      const firstNameInput = document.querySelector('#first_name');
      const lastNameInput = document.querySelector('#last_name');
      const emailInput = document.querySelector('#email');
      expect(firstNameInput).not.toBeNull();
      expect(lastNameInput).not.toBeNull();
      expect(emailInput).not.toBeNull();
    });
  
    test('registration form inputs have correct attributes', () => {
      const firstNameInput = document.querySelector('#first_name');
      const lastNameInput = document.querySelector('#last_name');
      const emailInput = document.querySelector('#email');
  
      expect(firstNameInput.getAttribute('type')).toBe('text');
      expect(firstNameInput.getAttribute('placeholder')).toBe('First Name');
      expect(firstNameInput.hasAttribute('required')).toBe(true);
  
      expect(lastNameInput.getAttribute('type')).toBe('text');
      expect(lastNameInput.getAttribute('placeholder')).toBe('Last Name');
      expect(lastNameInput.hasAttribute('required')).toBe(true);
  
      expect(emailInput.getAttribute('type')).toBe('email');
      expect(emailInput.getAttribute('placeholder')).toBe('Email');
      expect(emailInput.hasAttribute('required')).toBe(true);
    });
  
    test('contains a submit button', () => {
      const submitButton = document.querySelector('button[type="submit"]');
      expect(submitButton).not.toBeNull();
      expect(submitButton.textContent).toBe('Register');
    });
  
    test('includes the register.js script', () => {
      const scriptTag = document.querySelector('script[src="register.js"]');
      expect(scriptTag).not.toBeNull();
    });
  
    test('has correct CSS styles', () => {
      const styles = document.querySelector('style');
      expect(styles).not.toBeNull();
      const styleContent = styles.textContent;
      expect(styleContent).toContain('font-family: Arial, sans-serif');
      expect(styleContent).toContain('background-color: #f0f0f0');
      expect(styleContent).toContain('background-color: #4CAF50');
    });
  });
    

  describe('script.js', () => {
    let scriptContent;
    beforeAll(() => {
      scriptContent = fs.readFileSync(path.join(publicDir, 'script.js'), 'utf8');
    });

    test('contains Google Sign-In function', () => {
      expect(scriptContent).toContain('function handleCredentialResponse');
    });

    test('contains login function', () => {
      expect(scriptContent).toContain('function handleCredentialResponse');
    });
  });

  describe('register.js', () => {
    let scriptContent;
    beforeAll(() => {
      scriptContent = fs.readFileSync(path.join(publicDir, 'register.js'), 'utf8');
    });

    test('contains register function', () => {
      expect(scriptContent).toContain('function register');
    });
  });
});
