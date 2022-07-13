const assert = require('assert');
const request = require('supertest');
const { router } = require('../index.js');

const checkForError = done => (err, res) => {
  if (err) {
    done(err);
    return;
  }
  done();
}

const createHandler = predicate => (req, res) => {
  if (predicate(req)) {
    res.statusCode = 200;
    res.end('Success');
    return;
  }
  res.statusCode = 404;
  res.end('Error');
}

describe('Middleware', () => {
  it('Should inject the url inside of req object.', (done) => {
    const handler = createHandler((req) => req.url.pathname);
    router.get('/', handler);

    request((req, res) => router.routeTo(req, res))
      .get('/')
      .expect(200)
      .expect('Success')
      .end(checkForError(done));
  });

  it('Should set the cookie if client sends the cookie.', (done) => {
    router.reset();
    const handler = createHandler(
      (req) => req.cookies.testCookie === 'someData'
    );

    router.get('/', handler);
    request((req, res) => router.routeTo(req, res))
      .get('/')
      .set('Cookie', 'testCookie=someData')
      .expect(200)
      .expect('Success')
      .end(checkForError(done));
  });

  it('Should add maintain session', (done) => {
    router.reset();

    let sessionId;
    const handler1 = (req, res, next) => {
      sessionId = req.session.addData('session data');
      next();
    }

    const handler2 = createHandler(
      (req) => {
        const data = req.session.getSession(sessionId).data;
        return data === 'session data';
      }
    );

    router.get('/', handler1, handler2)

    request((req, res) => router.routeTo(req, res))
      .get('/')
      .expect(200)
      .expect('Success')
      .end(checkForError(done));
  });

  it('Should add rootDir to req object.', (done) => {
    router.reset();
    const handler = createHandler((req) => req.rootDir === './public');

    router.get('/', handler);

    request((req, res) => router.routeTo(req, res))
      .get('/')
      .expect(200)
      .expect('Success')
      .end(checkForError(done));
  });

  it('Should return 404 if route is not registered.', (done) => {
    router.reset();
    const handler = () => { };

    router.get('/', handler);

    request((req, res) => router.routeTo(req, res))
      .get('/unknown')
      .expect(404)
      .expect('Not found.')
      .end(checkForError(done));
  });

  it('Should return file content from rootDir.', (done) => {
    router.reset();
    const handler = () => { };

    router.get('/', handler);

    request((req, res) => router.routeTo(req, res))
      .get('/index.html')
      .expect('content-type', /html/)
      .expect(200)
      .expect(new RegExp('<title>Index</title>'))
      .end(checkForError(done));
  });
});