const fs = require('fs');
const App = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const {updateComment, formatComment, loadComments} = require('./serveComments');
const GUEST_PAGE = `${__dirname}/../public/guestBook.html`;
const STATIC_FOLDER = `${__dirname}/../public`;

const methodNotAllowed = (req, res) => {
  const statusCode = 400;
  res.writeHead(statusCode);
  res.end('Method Not Allowed');
};

const serveNotFound = (req, res) => {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Not Found');
};

const serveGuestBookPost = (req, res) => {
  const statusCode = 303;
  const content = req.body;
  const newComment = querystring.parse(content);
  updateComment(newComment);
  res.setHeader('Location', '/guestBook.html');
  res.writeHead(statusCode);
  res.end();
};

const serveGuestBook = (req, res) => {
  const statusCode = 200;
  const allComments = loadComments();
  const guestHtml = fs.readFileSync(GUEST_PAGE, 'utf8');
  const commentsHtml = allComments.reduce(formatComment, '');
  const content = guestHtml.replace('__comments__', commentsHtml);
  res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES.html});
  res.write(content);
  res.end();
};

const serveStaticFile = (req, res, next) => {
  const statusCode = 200;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absPath = `${STATIC_FOLDER}${path}`;
  const extension = absPath.split('.').pop();
  fs.readFile(absPath, (err, data) => {
    if (err) {
      next();
      return;
    }
    res.writeHead(statusCode, {'Content-Type': CONTENT_TYPES[extension]});
    res.write(data);
    res.end();
  });
};

const readBody = (req, res, next) => {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const app = new App();
app.use(readBody);
app.get('/guestBook.html', serveGuestBook);
app.get('', serveStaticFile);
app.get('', serveNotFound);

app.post('/saveComment', serveGuestBookPost);
app.post('', serveNotFound);
app.use(methodNotAllowed);

module.exports = {app};
