const fs = require('fs');
const COMMENT_DIR = `${__dirname}/../commentsDepot/comments.json`;

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

module.exports = {loadPrevComments, updateComment, formatComment};
