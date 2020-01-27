const {Server} = require('net');
const {processRequest} = require('./app');

const handleConnection = socket => {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn('new connection', remote);
  socket.setEncoding('utf8');
  socket.on('close', hadError => console.warn(`${remote} closed ${hadError ? 'with error' : ''}`));
  socket.on('end', () => console.warn(`${remote} ended`));
  socket.on('error', err => console.warn('socket error', err));
  socket.on('data', text => processRequest(text, socket));
};

const main = () => {
  const server = new Server();
  server.on('error', err => console.warn('server error', err));
  server.on('listening', () => console.warn('server started listening', server.address()));
  server.on('connection', handleConnection);
  server.listen(4000);
};

main();
