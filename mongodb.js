const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs'); // Corrected import for fs
const path = require('path');
const port = 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/Bookings", { useNewUrlParser: true, useUnifiedTopology: true }); // Corrected MongoDB connection string
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
    name: String,
    number: Number,
    place: String,
    persons: Number,
    departuredate: Date,
    arrivaldate: Date
});

const Users = mongoose.model("Users", userSchema); // Corrected model name

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "contact.html"), (err, data) => { // Asynchronous file read
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send(data.toString());
        }
    });
});

app.post('/post', async (req, res) => {
    const { name, number, place, persons, departuredate, arrivaldate } = req.body;
    const user = new Users({
        name,
        number,
        place,
        persons,
        departuredate,
        arrivaldate
    });

    try {
        await user.save();
        console.log(user);
        res.send("Booked Successfully!!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to Book");
    }
});

app.listen(port, () => {
    console.log("Server Started");
});