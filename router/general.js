const express = require('express');
const router = express.Router();
const books = require('./booksdb');
const axios = require('axios'); // ✅ THIS WAS MISSING

// 📚 Get all books
router.get('/', async (req, res) => {
    return res.status(200).json(books);
});

// 📘 Get book by ISBN
router.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ✍️ Get books by author
router.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    const result = {};

    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result[key] = books[key];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// 📖 Get books by title
router.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    const result = {};

    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result[key] = books[key];
        }
    }

    if (Object.keys(result).length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// 💬 Get book reviews
router.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ✍️ Add/Modify review
router.post('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username, review } = req.body;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review required" });
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: book.reviews
    });
});

// 🗑️ Delete review
router.delete('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!username) {
        return res.status(400).json({ message: "Username required" });
    }

    if (!book.reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete book.reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });
});


// 📚 Async route to get all books using Axios
router.get('/async/books', async (req, res) => {
    try {
        // Call own API using Axios
        const response = await axios.get('http://localhost:5000/books');

        // Send fetched data as response
        return res.status(200).json(response.data);

    } catch (error) {
        // Handle error if request fails
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// 📘 Async route to get book by ISBN using Axios
router.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        // Fetch all books
        const response = await axios.get('http://localhost:5000/books');
        const booksData = response.data;

        // Find book by ISBN
        const book = booksData[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error fetching book" });
    }
});

module.exports = router;