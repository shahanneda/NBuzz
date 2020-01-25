const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);// from my research we create our own http server instead of just using the one express gives so we can use the same one for socket io
const buzzList = [];

const port = 3000;
var socket = require('socket.io').listen(server);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get("/control", function (req, res) {
    res.sendFile(path.join(__dirname, "public/control.html"));
});
app.use(express.static(path.join(__dirname, 'public')))



socket.on('connect', function (io) {
    io.on('buzz', function (data) {
        console.log("Buzz!! \n " + data);
        io.broadcast.emit("buzz", data);
        buzzList.push(data);
        socket.emit("buzzListUpdate", { buzzList: buzzList });
    });

});
socket.on('disconnect', function () { });
server.listen(port);
