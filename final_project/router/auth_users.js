const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password)=>{
    let valid_users = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    
    if (valid_users.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(404).json({message: "Login error"})
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60})

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({message: `User '${username}' successfully logged in with access token '${accessToken}'.`})
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const user = req.session.authorization.username
    const review = req.body.review
    const isbn = req.params.isbn

    let book = books[isbn]

    if (book) {
        book.reviews[user] = {review: review}

        return res.status(200).send({book: book}, null, 2)
    } else {
        return res.status(208).json({message: "Book not found!"})
    } 
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const user = req.session.authorization.username
    const isbn = req.params.isbn

    let book = books[isbn]

    if (book) {
        if (book.reviews[user]) {
            delete book.reviews[user]

            return res.status(200).send({book: book}, null, 2)
        } else {
            return res.status(208).json({message: `There is not a rview from '${user}'`})
        }
    } else {
        return res.status(208).json({message: "Book not found!"})
    } 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
