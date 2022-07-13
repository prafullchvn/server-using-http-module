const Router = require('./router.js');

const injectUrl = require('../middleware/injectUrl.js');
const injectCookies = require('../middleware/injectCookies.js');
const injectSession = require('../middleware/injectSession.js');
const injectRootDir = require('../middleware/injectRootDir.js');

const notFound = require('../middleware/notFound');
const fileHandler = require('../middleware/fileHandler.js');

const router = new Router();

router.addMiddleware(injectUrl);
router.addMiddleware(injectCookies);
router.addMiddleware(injectSession);
router.addMiddleware(injectRootDir);

router.addDefaultHandler(fileHandler);
router.addDefaultHandler(notFound);

module.exports = router;