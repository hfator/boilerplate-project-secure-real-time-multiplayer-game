require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
  hidePoweredBy: ({ setTo: 'PHP 7.4.3' }),
  noSniff: true,
  xssFilter: true,
  noCache: true
}));

// For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket(server);
let players = {};
let collectibles = {};

for (let i = 0; i < 5; i++) {
  const id = `collectible-${i}`;
  collectibles[id] = {
    id,
    x: Math.random() * (500 - 20),
    y: Math.random() * (500 - 20),
    value: 10,
    width: 20,
    height: 20,
  };
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * (500 - 50),
    y: Math.random() * (500 - 50),
    score: 0,
    width: 50,
    height: 50,
  };

  socket.emit('init', {
    id: socket.id,
    playersData: players,
    collectiblesData: collectibles,
  });

  io.emit('updatePlayers', players);

  socket.on('updatePosition', ({ x, y, score }) => {
    if (players[socket.id]) {
      players[socket.id].x = x;
      players[socket.id].y = y;
      players[socket.id].score = score;

      io.emit('updatePlayers', players);
    }
  });

  socket.on('collect', ({ collectibleId, playerId }) => {
    if (collectibles[collectibleId]) {
      delete collectibles[collectibleId];

      const newId = `collectible-${Date.now()}`;
      collectibles[newId] = {
        id: newId,
        x: Math.random() * (500 - 20),
        y: Math.random() * (500 - 20),
        value: 10,
        width: 20,
        height: 20,
      };

      io.emit('updateCollectibles', collectibles);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

module.exports = app; // For testing
