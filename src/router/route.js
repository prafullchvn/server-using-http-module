const createNext = (handlers) => {
  let index = 0;

  const next = (req, res) => {
    const currentHandler = handlers[index];
    index++;

    if (currentHandler !== handlers[handlers.length - 1]) {
      currentHandler(req, res, () => next(req, res));
      return;
    }
    currentHandler(req, res, () => { });
  }

  return next;
};

class Route {
  #handlers;
  constructor() {
    this.#handlers = {};
  }

  addHandler(method, ...handlers) {
    const list = this.#handlers[method] || [];
    list.push(...handlers);
    this.#handlers[method] = list;
  }

  routeTo(req, res) {
    const { method } = req;
    const handlers = this.#handlers[method.toUpperCase()];
    if (!handlers) {
      res.statusCode = 405;
      res.end('Bad request');
      return;
    }

    const next = createNext(handlers);
    next(req, res);
  }
}

module.exports = { Route, createNext }; 