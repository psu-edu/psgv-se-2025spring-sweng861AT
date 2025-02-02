const axios = require('axios');

const API_URL = 'https://potterapi-fedeperin.vercel.app/en/books';

async function fetchBooks() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching book data:', error);
    throw error;
  }
}

module.exports = { fetchBooks };
