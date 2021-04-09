const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);

// init a new instance of socket.io by passing it the http server object
const io = require('socket.io')(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersController = require('./controllers/users');
app.use('/users', usersController);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  // listen on the connection/disconnection event for sockets
io.on('connection', (socket) => {
    console.log('a user connected');

    // This will emit the event to all connected sockets
    // io.emit('chat message', { someProperty: 'some value', otherProperty: 'other value' }); 

    // send a message to everyone except for a certain emitting socket
    socket.broadcast.emit('hi');

    // print chat message when chat message event is received
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);   // this emits to everyone including sender
        console.log('message: ' + msg);
      });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

const port = process.env.PORT || 4000;

// app.listen(port, () => {
// 	console.log(`app is listening on port ${port}`);
// });

server.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
