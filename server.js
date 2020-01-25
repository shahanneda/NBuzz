const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);// from my research we create our own http server instead of just using the one express gives so we can use the same one for socket io
const ip = require("ip");
var buzzList = [];

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
    socket.emit("buzzListUpdate", { buzzList: buzzList });
    io.on('buzz', function (data) {
        console.log("Buzz!! \n " + data);
        io.broadcast.emit("buzz", data);
        buzzList.push(data);
        SortBuzzList();
        buzzList.reverse();
        console.log(buzzList);
        socket.emit("buzzListUpdate", { buzzList: buzzList });
    });

    io.on("buzzListClear", function (data) {
        buzzList = [];
        socket.emit("buzzListUpdate", { buzzList: buzzList });
    })

});
socket.on('disconnect', function () { });
server.listen(port);
let fullAddress = ip.address() + ":" + port;
console.log("Server Started \nIP address: " + ip.address() + "\nPort: " + port + "\nFull Address: " + ip.address() + ":" + port);
SortBuzzList();

function SortBuzzList() {//simple insertion sort
    for (var i = 0; i < buzzList.length; i++) {
        let j = i;
        while (j > 0) {
            if (buzzList[j - 1].time > buzzList[j].time) {
                swap(j - 1, j);
            }
            j--;
        }
    }
}

const https = require("https");
const options = {
    hostname: 'leanqualityacademy.com',
    port: 443,
    path: '/buzz/buzzSet.php?url=' + fullAddress,
    method: 'GET'
}

const req = https.request(options, function (res) {
    console.log("\nSent address to server \nAddress Sent: " + fullAddress + "\nStatus Code:" + res.statusCode);

})

req.on('error', function (error) {
    console.error(error);
});

req.end()
function swap(first, second) {
    let old = buzzList[first];
    buzzList[first] = buzzList[second];
    buzzList[second] = old;
}