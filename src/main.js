const createHandler = (router, rootDir = './public') => (req, res) => {
  req.rootDir = rootDir;
  router.routeTo(req, res);
}

module.exports = { createHandler };
