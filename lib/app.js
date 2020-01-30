'use strict';
const matchRoute = (route, req) => {
  if (route.method) return req.method === route.method && req.url.match(route.path);
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
    console.warn('Request', req.method, req.url);
    const matchingHandlers = this.routes.filter(route => matchRoute(route, req));
    const next = () => {
      if (matchingHandlers.length === 0) return;
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

module.exports = App;
