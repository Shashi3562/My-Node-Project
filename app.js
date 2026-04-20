// Import Modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// Note: body-parser and express-error-handler were removed (see explanation below)

// Initialize Express Apps
const app = express();      // Port 3000: Todo, Weather
const chatApp = express();  // Port 3001: Chat

// --- Chat Server Settings ---
const http = require("http").createServer(chatApp);
const io = require("socket.io")(http);
module.exports = io; // Exported to use in Controllers

chatApp.set("view engine", "ejs");
chatApp.engine("html", require("ejs").renderFile);
chatApp.set("views", path.join(__dirname, "views"));
chatApp.use("/public", express.static(path.join(__dirname, "public")));

// --- Main Server Settings ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));

// Use Express's built-in body parsing (replaces body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --- Router Settings ---
const router = require("./routes/index");
chatApp.use(router);
app.use(router);

// --- Modern 404 Error Handling ---
// Replaces the outdated express-error-handler package
const notFoundHandler = (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
};

app.use(notFoundHandler);
chatApp.use(notFoundHandler);

// --- Start Chat Server ---
http.listen(3001, () => {
    console.log("Chat Server listening on port 3001!");
});

// --- Connect to Database & Start Main Server ---
// Updated Mongoose connection to use Promises instead of deprecated callbacks
mongoose.connect("mongodb://localhost:27017/node")
    .then(() => {
        console.log("mongoDB Connected!");

        // Start main server only after DB connects successfully
        app.listen(3000, () => {
            console.log("Server listening on port 3000!");
        });
    })
    .catch((err) => {
        console.error("mongoDB Connection Error!", err);
        console.error("New error");
    });