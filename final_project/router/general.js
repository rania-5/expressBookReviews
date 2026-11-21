const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Unable to register user. Username and password are required."});
  }
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({message: "User already exists!"});
  }
  users.push({ username: username, password: password });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      result[isbn] = books[isbn];
    }
  });
  return res.status(200).send(JSON.stringify(result, null, 4));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      result[isbn] = books[isbn];
    }
  });
  return res.status(200).send(JSON.stringify(result, null, 4));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

// Task 10: Get all books using async/await with Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error.message);
  }
};

// Task 11: Get book details by ISBN using Promise callbacks with Axios
const getBookByISBN = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching book by ISBN:', error.message);
    });
};

// Task 12: Get book details by author using async/await with Axios
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
  }
};

// Task 13: Get book details by title using async/await with Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
  }
};


module.exports.general = public_users;
