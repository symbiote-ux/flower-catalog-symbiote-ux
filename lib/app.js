'use strict';
const matchRoute = (route, req) => {
  if (route.method) {
    return req.method === route.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({path, handler, method: 'GET'});
  }
  post(path, handler) {
    this.routes.push({path, handler, method: 'POST'});
  }
  use(middleware) {
    this.routes.push({handler: middleware});
  }
  serve(req, res) {
    const matchedHandlers = this.routes.filter(route => matchRoute(route, req));
    const next = () => {
      const router = matchedHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

module.exports = App;
