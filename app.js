const fs = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');

const STATIC_FOLDER = `${__dirname}/public`;
const COMMENT_DIR = `${__dirname}/commentsDepot/comments.json`;

const updateComment = (allComments, newComment) => {
  newComment.time = new Date().toLocaleString();
  allComments.unshift(newComment);
  fs.writeFileSync(COMMENT_DIR, JSON.stringify(allComments));
};

const replaceUrlSymbols = body => {
  let name = body.name;
  let comment = body.comment;
  let updComment = comment.replace(/\+/g, ' ');
  updComment = updComment.replace(/%0D%0A/g, '<br>');
  const updName = name.replace(/\+/g, ' ');
  body.name = updName;
  body.comment = updComment;
  return body;
};

const serveGuestBookPost = req => {
  const allComments = loadPrevComments();
  const comment = replaceUrlSymbols(req.body);
  updateComment(allComments, comment);
  return serveGuestBook();
};

const formatComment = (commentRows, comment) => {
  const html = `
  <tr>\r\n
    <td>${comment.name}</td>\r\n
    <td>${comment.comment}</td>\r\n
    <td>${comment.time}</td>\r\n
  </tr>\r\n`;
  return commentRows + html;
};

const loadPrevComments = () => {
  const comments = fs.readFileSync(COMMENT_DIR, 'utf8');
  return JSON.parse(comments);
};

const serveGuestBook = () => {
  const template = fs.readFileSync('./public/guestBook.html', 'utf8');
  const allComments = loadPrevComments();
  const commentsHtml = allComments.reduce(formatComment, '');
  const content = template.replace('__comments__', commentsHtml);
  const res = new Response();
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Type', contentType);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveHomePage = req => {
  const html = fs.readFileSync(`${STATIC_FOLDER}${req.url}index.html`);
  const res = new Response();
  res.setHeader('Content-Length', html.length);
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const findHandler = req => {
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestBook;
  if (req.method === 'POST' && req.url === '/guestBookPost.html') return serveGuestBookPost;
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
};

const processRequest = req => {
  const handler = findHandler(req);
  return handler(req);
};

module.exports = {processRequest};
