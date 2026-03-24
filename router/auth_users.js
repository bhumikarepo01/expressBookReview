const express = require('express');
const router = express.Router();

let users = [];

// ✅ Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: "User registered successfully"
    });
}); 


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = "abc123"; // temporary token

    return res.status(200).json({
        message: "Login successful",
        token: token
    });
});

// router.post('/review/:isbn', (req, res) => {
//     const isbn = req.params.isbn;
//     const { username, review } = req.body;

//     const book = books[isbn];

//     if (!book) {
//         return res.status(404).json({ message: "Book not found" });
//     }

//     if (!username || !review) {
//         return res.status(400).json({ message: "Username and review required" });
//     }

//     book.reviews[username] = review;

//     return res.status(200).json({
//         message: "Review added/updated successfully",
//         reviews: book.reviews
//     });
// });

module.exports = router;