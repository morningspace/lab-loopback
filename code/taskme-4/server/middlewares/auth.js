'use strict';

module.exports = function() {
  return function (req, res, next) {
    if (req.query && req.query.access_token) {
      next();
    } else {
      res.sendStatus(401);
    }
  }
};
