const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodePath = require('path'); 
const { startAttack, stopAttack } = require('./attack');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(nodePath.join(__dirname, '../public')));

app.post('/login', (req, res) => {
  const { nickname, password } = req.body;
  const loginData = fs.readFileSync(nodePath.join(__dirname, '../public/login.txt'), 'utf8');
  const users = loginData.split('\n').map(line => line.trim());

  if (users.includes(`${nickname}:${password}`)) {
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/dfkdsbfjsdfbdsfdsfhdsf', (req, res) => {
  res.sendFile(nodePath.join(__dirname, '../public/attack.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('startAttack', (data) => {
    const { url, time } = data;
    startAttack(url, time, socket);
  });

  socket.on('stopAttack', () => {
    stopAttack();
    socket.emit('attackStopped');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
