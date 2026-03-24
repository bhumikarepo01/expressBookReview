const express = require('express');
const app = express();

const general = require('./router/general');
const auth_users = require('./router/auth_users');

app.use(express.json());

app.use('/books', general);

app.use('/', auth_users);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});