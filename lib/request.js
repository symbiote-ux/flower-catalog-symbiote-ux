'use strict';
const replaceUrlSymbols = function(value) {
  value = value.replace(/\+/g, ' ');
  return decodeURIComponent(value);
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = replaceUrlSymbols(value);
  return query;
};
const readParams = keyValueTextPairs => keyValueTextPairs.split('&').reduce(pickupParams, {});

const collectHeaderAndBody = (result, line) => {
  if (line === '') {
    result.body = '';
    return result;
  }
  if ('body' in result) {
    result.body += line;
    return result;
  }
  const [key, value] = line.split(':');
  result.headers[key] = value;
  return result;
};

class Request {
  constructor(method, url, headers, body) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.body = body;
  }
  static parse(reqText) {
    const [requestLine, ...headersAndBody] = reqText.split('\r\n');
    const [method, url] = requestLine.split(' ');
    let {headers, body} = headersAndBody.reduce(collectHeaderAndBody, {headers: {}});
    if (headers['Content-Type'] === ' application/x-www-form-urlencoded') {
      body = readParams(body);
    }
    const req = new Request(method, url, headers, body);
    return req;
  }
}

module.exports = Request;
