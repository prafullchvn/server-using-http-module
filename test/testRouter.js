const assert = require('assert');
const { Router } = require('../index.js');

describe('Router', () => {
  it('Should go to designated handler of path.', () => {
    const router = new Router();
    let noOfCall = 0;
    const handler = () => noOfCall++;

    router.get('/', handler);
    const req = { method: 'get', url: { pathname: '/' } };
    router.routeTo(req, {});

    assert.deepStrictEqual(noOfCall, 1);
  });

  it('Should go to default handler function if route is not found', () => {
    let noOfCall = 0;

    const router = new Router();
    const defaultHandler = () => noOfCall++;
    router.addDefaultHandler(defaultHandler);

    const req = { method: 'get', url: { pathname: '/' } };
    router.routeTo(req, {});

    assert.deepStrictEqual(noOfCall, 1);
  });

  it('Should give call to middleware function before executing the handler',
    () => {
      let noOfCall = 0;

      const router = new Router();
      const middleware = () => noOfCall++;
      router.addMiddleware(middleware);

      const req = { method: 'get', url: { pathname: '/' } };
      router.get('/', () => { });
      router.routeTo(req, {});
      assert.deepStrictEqual(noOfCall, 1);
    });

  it('Should give call to execute all the handlers of particular path.', () => {
    let noOfCall = 0;

    const router = new Router();
    const handler1 = (a, b, next) => { noOfCall++; next(); };
    const handler2 = (a, b, next) => { noOfCall++; next(); };
    const handler3 = () => { noOfCall++; };

    const req = { method: 'get', url: { pathname: '/' } };
    router.get('/', handler1, handler2, handler3);
    router.routeTo(req, {});
    assert.deepStrictEqual(noOfCall, 3);
  });

  it(
    'Should return 501 status code if wrong method is used to call the handler',
    () => {
      const router = new Router();
      const mockedResponse = {
        statusCode: -1, message: '', end: function (actualMessage) {
          this.message = actualMessage;
        }
      };

      const req = { method: 'get', url: { pathname: '/' } };

      router.post('/', () => { });
      router.routeTo(req, mockedResponse);

      assert.deepStrictEqual(mockedResponse.statusCode, 405);
      assert.deepStrictEqual(mockedResponse.message, 'Bad request');
    });

  it(
    'Should give not  give error if no handler handles the request.',
    () => {
      const router = new Router();
      const req = { method: 'get', url: { pathname: '/' } };

      router.get('/', (a, b, next) => { next() });
      assert.ok(() => router.routeTo(req, {}));
    }
  );

  it(
    'Should visit the same handler when regex is used as pathname.',
    () => {
      const router = new Router();
      const req = { method: 'get', url: { pathname: '/prafull' } };
      let noOfCall = 0;
      const handler = () => noOfCall++;

      router.get('/p.*', handler);
      router.routeTo(req, {});

      req.url.pathname = '/poster';
      router.routeTo(req, {});

      assert.strictEqual(noOfCall, 2);
    }
  );
});