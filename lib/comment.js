class Comment {
  constructor(name, time, msg) {
    this.name = name;
    this.time = time;
    this.msg = msg;
  }
  toHTML() {
    return `
    <tr>
    <td>${this.name}</td>
    <td>${new Date(this.time).toLocaleString()}</td>
    <td>${this.msg}</td>
    </tr>
    `;
  }
}

class Comments {
  constructor() {
    this.comments = [];
  }
  addComment(comment) {
    this.comments.unshift(comment);
  }
  toHTML() {
    return this.comments.map(comment => comment.toHTML()).join('');
  }
  static load(content) {
    const commentList = JSON.parse(content || '[]');
    const comments = new Comments();
    commentList.forEach(com => {
      comments.comments.push(new Comment(com.name, new Date(com.time).toJSON(), com.msg));
    });
    return comments;
  }
  toJSON() {
    return JSON.stringify(this.comments);
  }
}

module.exports = {Comment, Comments};
