const fs = require('fs');
const Response = require('./response');
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
  return prevComments;
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

const showGuestPage = function(allComments, sendResponse) {
  const guestHtml = fs.readFileSync(GUEST_PAGE, 'utf8');
  const commentsHtml = allComments.reduce(formatComment, '');
  const content = guestHtml.replace('__comments__', commentsHtml);
  const res = new Response();
  res.setHeader('Content-Length', content.length);
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.statusCode = 200;
  res.body = content;
  sendResponse(res);
};

const serveGuestBookPost = (req, sendResponse) => {
  const updatedComments = updateComment(req.body);
  showGuestPage(updatedComments, sendResponse);
};

const serveGuestBook = (req, sendResponse) => {
  const allComments = loadPrevComments();
  showGuestPage(allComments, sendResponse);
};

module.exports = {serveGuestBook, serveGuestBookPost};
