require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');

const db = require('./config/database');

db.authenticate()
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Error: " + err);
    })

app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use(require("./routes/Users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});