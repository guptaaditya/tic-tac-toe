const express = require('express');
const app = express();
const server = require('http').Server(app);
const { socketConnections } = require('./sockets');

const initSocket = new socketConnections(server);

app.use(express.static('build'));
app.use(express.static('.'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

server.listen(80);