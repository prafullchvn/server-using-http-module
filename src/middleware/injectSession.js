const Session = require('../session.js');

module.exports = (req, res, next) => {
  req.session = new Session();
  next();
}