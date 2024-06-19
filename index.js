const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT;

const users = require('./routes/users');
const documents = require("./routes/documents");

app.use(express.json());
app.use(cors());

app.use('/users', users);
app.use('/documents', documents);

app.get("/", (req, res) => {
    res.send("Hello");
})

app.listen(port, () => {
    console.log(`Server listening on the port: ${port}`);
})