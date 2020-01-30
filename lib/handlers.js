const fs = require('fs');
const App = require('./app');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const {updateComment, formatComment, loadPrevComments} = require('./serveComments');
const GUEST_PAGE = `${__dirname}/../public/guestBook.html`;
const STATIC_FOLDER = `${__dirname}/../public`;

const serveNotFound = (req, res) => {
  res.writeHead(404);
  res.end('Not Found');
};

const serveGuestBookPost = (req, res) => {
  const content = req.body;
  const newComment = querystring.parse(content);
  updateComment(newComment);
  res.setHeader('Location', '/guestBook.html');
  res.writeHead(303);
  res.end();
};

const serveGuestBook = (req, res, next) => {
  const allComments = loadPrevComments();
  const guestHtml = fs.readFileSync(GUEST_PAGE, 'utf8');
  const commentsHtml = allComments.reduce(formatComment, '');
  const content = guestHtml.replace('__comments__', commentsHtml);
  res.writeHead(200, {'Content-Type': CONTENT_TYPES.html, 'Content-Length': content.length});
  res.write(content);
  res.end();
};

const serveStaticFile = (req, res, next) => {
  const path = req.url === '/' ? '/index.html' : req.url;
  const absPath = `${STATIC_FOLDER}${path}`;
  const extension = absPath.split('.').pop();
  fs.readFile(absPath, (err, data) => {
    if (err) {
      next();
      return;
    }
    res.writeHead(200, {'Content-Type': CONTENT_TYPES[extension], 'Content-Length': data.length});
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

module.exports = {app};
