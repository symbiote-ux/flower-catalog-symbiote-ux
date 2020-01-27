const Request = require('./lib/request');
const {serveGuestBook, serveGuestBookPost} = require('./lib/serveGuestBookPages');
const {serveStaticFile} = require('./lib/serveStaticFile');

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestBook;
  if (req.method === 'POST' && req.url === '/guestBook.html') return serveGuestBookPost;
  return serveStaticFile;
};

const processRequest = (text, socket) => {
  const req = Request.parse(text);
  const handler = findHandler(req);
  const sendResponse = response => response.writeTo(socket);
  handler(req, sendResponse);
};

module.exports = {processRequest};
