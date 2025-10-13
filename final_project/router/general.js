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
    res.send(JSON.stringify(books,null,2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn

    res.send(JSON.stringify(books[isbn],null,2));
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {

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

    res.send(response)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

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

    res.send(response)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn

    res.send({reviews: books[isbn].reviews});
});

module.exports.general = public_users;
