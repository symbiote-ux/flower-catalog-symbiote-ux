const request = require('supertest');
const {app} = require('../lib/handlers');

describe('Get home page', () => {
  it('should get homepage on / path', done => {
    request(app.serve.bind(app))
    .get('/')
    .set('Accept','*/*')
    .expect(200)
    .expect('Content-Type','text/html',done)
    .expect('Content-Length',"1103")
    .expect(/Guest Book/)  
  });
});

describe('Get non Existing url',()=>{
  it('gives 404 for non existing url or page',(done)=>{
    request(app.serve.bind(app))
    .get('/badPage')
    .expect(404,done);
  })
})

describe('Get guest book page',()=>{
  it('give guest page on /guestBook.html path',(done)=>{
    request(app.serve.bind(app))
    .get('/guestBook.html')
    .expect(200)
    .expect('Content-Type','text/html',done)
    .expect('Content-Length','2499')
    .expect(/Leave a comment/)
  })
})

describe('serve guest book post ',()=>{
  it('should save the comment and redirect the page',(done)=>{
    request(app.serve.bind(app))
    .post('/saveComment')
    .send('name=John')
    .expect(303)
    .expect('Location', '/guestBook.html',done)
  })
})