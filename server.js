const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, function () {

    console.log("Server Running on port " + port);

});