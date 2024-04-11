const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!isValid(username)) {
		return res.status(400).json({ message: "Username already exists." });
	}

	users.push({
		username,
		password,
	});

	return res.status(200).send("User successfully registered.");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	return res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;
	const booksByAuthor = [];

	for (const [isbn, book] of Object.entries(books)) {
		if (book.author === author) {
			booksByAuthor.push({
				isbn,
				...book,
			});
		}
	}

	return res.send(JSON.stringify({ booksByAuthor }, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	const booksByTitle = [];

	for (const [isbn, book] of Object.entries(books)) {
		if (book.title === title) {
			booksByTitle.push({
				isbn,
				...book,
			});
		}
	}

	return res.send(JSON.stringify({ booksByTitle }, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
