const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: `User '${username}' successfully registered.`});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    let allBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books,null,2);
            } else {
                reject({message: 'Books not found!'});
            }
        }, 1000);
    });

    allBooks
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    
    let book = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn],null,2);
            } else {
                reject({message: `Books not found with ISBN: '${isbn}'!`});
            }
        }, 1000);
    });

    book
        .then(result => res.send(result))
        .catch(error => res.send(error));
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    let bookAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            let response = {}

            for (const [key, value] of Object.entries(books)) {
                if (value.author == req.params.author) {
                    response = {
                        ...response,
                        [key]: {
                            author: value.author,
                            title: value.title,
                            reviews: value.reviews
                        }
                    }
                }
            }

            if (Object.keys(response).length === 0) {
                reject({message: `Books not found with author: '${req.params.author}'!`});
            } else {
                resolve(response);
            }
        }, 1000);
    });

    bookAuthor
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    let bookTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            let response = {}

            for (const [key, value] of Object.entries(books)) {

                if (value.title == req.params.title) {
                    response = {
                        ...response,
                        [key]: {
                            author: value.author,
                            title: value.title,
                            reviews: value.reviews
                        }
                    }
                }
            }

            if (Object.keys(response).length === 0) {
                reject({message: `Books not found with title: '${req.params.title}'!`});
            } else {
                resolve(response);
            }
        }, 1000);
    });

    bookTitle
        .then(result => res.send(result))
        .catch(error => res.send(error));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn

    res.send({reviews: books[isbn].reviews});
});

module.exports.general = public_users;