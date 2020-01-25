const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);// from my research we create our own http server instead of just using the one express gives so we can use the same one for socket io

const port = 3000;
var socket = require('socket.io').listen(server);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')))



socket.on('connect', function (io) {
    io.on('event', function (data) {
        console.log(data);
    });

    socket.emit("new", {});
});
socket.on('disconnect', function () { });
server.listen(port);
