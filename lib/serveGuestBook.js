const fs = require('fs');
const Response = require('./response');
const CONTENT_TYPES = require('./mimeTypes');
const COMMENT_DIR = `${__dirname}/../commentsDepot/comments.json`;
const GUEST_PAGE = `${__dirname}/../templates/guestBook.html`;

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
  const template = fs.readFileSync(GUEST_PAGE, 'utf8');
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

module.exports = {serveGuestBook, serveGuestBookPost};
