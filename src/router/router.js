const { Route, createNext } = require('./route.js');

class Router {
  #routes;
  #defaultHandlers;
  #middleware;
  constructor() {
    this.#routes = {};
    this.#middleware = [];
    this.#defaultHandlers = [];
  }

  get(pathString, ...handler) {
    const path = pathString.toLowerCase();
    const route = this.#routes[path] || new Route();

    route.addHandler('GET', ...handler);
    this.#routes[path] = route;
  }

  post(pathString, ...handler) {
    const path = pathString.toLowerCase();
    const route = this.#routes[path] || new Route();

    route.addHandler('POST', ...handler);
    this.#routes[path] = route;
  }

  addDefaultHandler(handler) {
    this.#defaultHandlers.push(handler);
  }

  addMiddleware(...middleware) {
    this.#middleware.push(...middleware);
  }

  #runMiddlewares(request, response) {
    if (this.#middleware.length > 0) {
      const next = createNext(this.#middleware);
      next(request, response);
    }
  }

  #getRoute(pathname) {
    const routeEntry = Object.entries(this.#routes).find(([path]) => {
      const pathRegEx = new RegExp(`^${path}$`, 'i');
      return pathRegEx.test(pathname)
    });

    return routeEntry && routeEntry[1];
  }

  routeTo(request, response) {
    const pathname = request.url;

    const route = this.#getRoute(pathname);
    this.#runMiddlewares(request, response);

    if (route) {
      route.routeTo(request, response);
      return;
    }

    if (this.#defaultHandlers.length > 0) {
      const next = createNext(this.#defaultHandlers);
      next(request, response);
    }
  }

  reset() {
    this.#routes = {};
  }
}

module.exports = Router;
