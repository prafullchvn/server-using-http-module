const http = require('http');
const { createHandler } = require('./main.js');
const { router } = require('./router/routes.js');

const startServer = (port, router, rootDir = './public') => {
  const server = http.createServer(createHandler(router, rootDir));

  server.listen(port, () => {
    console.log('Connected to server on port', server.address().port);
  });
}

module.exports = { startServer };