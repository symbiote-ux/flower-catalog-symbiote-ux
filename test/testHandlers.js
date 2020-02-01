const fs = require('fs');
const request = require('supertest');
const {app} = require('../lib/handlers');
const config = require('../config');

describe('Get home page', () => {
  it('should get homepage on / path', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect(/Guest Book/);
  });
});

describe('Get non Existing url', () => {
  it('gives 404 for non existing url or page', done => {
    request(app.serve.bind(app))
      .get('/badPage')
      .expect(404, done);
  });
});

describe('Get guest book page', () => {
  it('give guest page on /guestBook.html path', done => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/Leave a comment/);
  });
});

describe('serve guest book post ', () => {
  it('should save the comment and redirect the page', done => {
    request(app.serve.bind(app))
      .post('/saveComment')
      .send('name=John&msg=hey dude')
      .expect(303)
      .expect('Location', '/guestBook.html', done);
  });
  it('redirected to GET guestBook Page ', done => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/<td>John<\/td>/);
  });
  after(() => {
    fs.truncateSync(config.DATA_STORE);
  });
});

describe('PUT /url', () => {
  it('respond 400 "Method not allowed" to this request method', done => {
    request(app.serve.bind(app))
      .put('/url')
      .expect(400)
      .expect('Method Not Allowed', done);
  });
});
