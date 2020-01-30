const {Server} = require('http');
const {app} = require('./lib/handlers');

const main = () => {
  const server = new Server(app.serve.bind(app));
  server.on('listening', () => console.warn('server started listening', server.address()));
  server.listen(4000);
};
main();
