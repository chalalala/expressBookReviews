const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	const hasExisted = users.some((user) => user.username === username);

	if (!hasExisted) {
		return true;
	}

	return false;
};

const authenticatedUser = (username, password) => {
	const sessionUser = users.find((user) => user.username === username);

	if (!sessionUser || sessionUser.password !== password) {
		return false;
	}

	return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username) {
		return res.status(400).json({ message: "Username is missing." });
	}

	if (!password) {
		return res.status(400).json({ message: "Password is missing." });
	}

	if (!authenticatedUser(username, password)) {
		return res
			.status(400)
			.json({ message: "Incorrect username or password" });
	}

	let accessToken = jwt.sign(
		{
			data: { username, password },
		},
		"access",
		{ expiresIn: 60 * 60 }
	);

	req.session.authorization = {
		accessToken,
		username,
	};

	return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const review = req.query.review;

	if (!review) {
		res.status(400).send("Review is empty.");
	}

	const book = books[isbn];
	const sessionUsername = req.session.authorization["username"];

	book.reviews[sessionUsername] = review;

	return res.status(200).json({
		message: `The review for book with ISNB ${isbn} has been added/updated`,
	});
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const book = books[isbn];
	const sessionUsername = req.session.authorization["username"];

	delete book.reviews[sessionUsername];

	return res.status(200).json({
		message: `The review for book with ISNB ${isbn} by the user ${sessionUsername} has been deleted.`,
	});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
