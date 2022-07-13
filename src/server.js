const http = require('http');

const startServer = (port, router) => {
  const server = http.createServer((req, res) => router.routeTo(req, res));

  server.listen(port, () => {
    console.log('Connected to server on port', server.address().port);
  });
}

module.exports = { startServer };