const {Server} = require('http');
const {serveGuestBook, serveGuestBookPost} = require('./lib/serveGuestBookPages');
const {serveStaticFile} = require('./lib/serveStaticFile');

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestBook;
  if (req.method === 'POST' && req.url === '/saveComment') return serveGuestBookPost;
  return serveStaticFile;
};

const handleConnection = (req, res) => {
  const handler = findHandler(req);
  handler(req, res);
};

const main = () => {
  const server = new Server(handleConnection);
  server.on('listening', () => console.warn('server started listening', server.address()));
  server.listen(4000);
};
main();
