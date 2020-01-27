const fs = require('fs');
const Response = require('./response');
const CONTENT_TYPES = require('./mimeTypes');
const STATIC_FOLDER = `${__dirname}/../public`;

const getPathAndContentType = url => {
  if (url === '/') url = '/index.html';
  const path = `${STATIC_FOLDER}${url}`;
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  return {path, contentType};
};

const serveStaticFile = (req, sendResponse) => {
  const res = new Response();
  const {path, contentType} = getPathAndContentType(req.url);
  fs.readFile(path, (err, data) => {
    if (!err) {
      res.setHeader('Content-Length', data.length);
      res.setHeader('Content-Type', contentType);
      res.statusCode = 200;
      res.body = data;
    }
    sendResponse(res);
  });
};

module.exports = {serveStaticFile};
