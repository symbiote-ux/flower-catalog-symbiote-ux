const fs = require('fs');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;

const getPathAndContentType = url => {
  if (url === '/') url = '/index.html';
  const path = `${STATIC_FOLDER}${url}`;
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  return {path, contentType};
};

const serveStaticFile = (req, res) => {
  const {path, contentType} = getPathAndContentType(req.url);
  fs.readFile(path, (err, data) => {
    if (err) {
      res.write('<html><center><h1>404<br/>Not Found</h1></center></html>');
      res.end();
      return;
    }
    res.writeHead(200, {'content-type': contentType});
    res.write(data);
    res.end();
  });
};

module.exports = {serveStaticFile};
