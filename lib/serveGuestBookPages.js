const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const COMMENT_DIR = `${__dirname}/../commentsDepot/comments.json`;
const GUEST_PAGE = `${__dirname}/../templates/guestBook.html`;

const loadPrevComments = () => {
  const comments = fs.readFileSync(COMMENT_DIR, 'utf8');
  return JSON.parse(comments);
};

const updateComment = newComment => {
  const prevComments = loadPrevComments();
  newComment.time = new Date().toJSON();
  prevComments.unshift(newComment);
  fs.writeFile(COMMENT_DIR, JSON.stringify(prevComments, null, 2), () => {});
};

const formatComment = (commentRows, comment) => {
  const message = comment.msg.replace(/(\r\n)/g, '<br />');
  const html = `
  <tr>\r\n
    <td>${comment.name}</td>\r\n
    <td>${comment.time}</td>\r\n
    <td>${message}</td>\r\n
  </tr>\r\n`;
  return commentRows + html;
};

const serveGuestBookPost = (req, res) => {
  let content = '';
  req.setEncoding('utf8');
  req.on('data', body => {
    content += body;
  });
  req.on('end', () => {
    const newComment = querystring.parse(content);
    updateComment(newComment);
    res.setHeader('Location', '/guestBook.html');
    res.writeHead(301);
    res.end();
  });
};

const serveGuestBook = (req, res) => {
  const allComments = loadPrevComments();
  const guestHtml = fs.readFileSync(GUEST_PAGE, 'utf8');
  const commentsHtml = allComments.reduce(formatComment, '');
  const content = guestHtml.replace('__comments__', commentsHtml);
  res.writeHead(200, {'Content-Type': CONTENT_TYPES.html});
  res.write(content);
  res.end();
};

module.exports = {serveGuestBook, serveGuestBookPost};
