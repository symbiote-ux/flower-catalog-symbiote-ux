const fs = require('fs');
const App = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const GUEST_PAGE = `${__dirname}/../template/guestBook.html`;
const STATIC_FOLDER = `${__dirname}/../public`;
const {Comment, Comments} = require('./comment');
const config = require('../config');
const COMMENT_STORE = config.DATA_STORE;
const comments = Comments.load(fs.readFileSync(COMMENT_STORE, 'utf8'));

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
  req.body = querystring.parse(req.body);
  const comment = new Comment(req.body.name, new Date(), req.body.msg);
  comments.addComment(comment);
  fs.writeFileSync(COMMENT_STORE, comments.toJSON());
  res.writeHead(statusCode, {
    Location: '/guestBook.html'
  });
  res.end();
};

const serveGuestBook = (req, res) => {
  const guestHtml = fs.readFileSync(GUEST_PAGE, 'utf8');
  const okStatusCode = 200;
  res.writeHead(okStatusCode, {'Content-Type': 'text/html'});
  res.end(guestHtml.replace('__COMMENT__', comments.toHTML()));
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
    res.end(data);
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
