const Router = require('./src/router/router.js');
const router = require('./src/router/routes.js');
const { startServer } = require('./src/server.js');

module.exports = { Router, startServer, router };
