const {Server} = require('http');
const {app} = require('./lib/handlers');

const main = () => {
  const port = 4000;
  const server = new Server(app.serve.bind(app));
  server.listen(port);
};
main();
