const jwt = require('jsonwebtoken');

module.exports.requireAuthentication = function (req, res, next) {
  const myToken = req.query.token || req.body.token || req.headers['authorization'];
  
  if (myToken) {
    jwt.verify(myToken, "EngWebTP2024", function (err, payload) {
      if (err) {
        return res.status(401).jsonp({ error: 'Unauthorized access' });
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    return res.status(401).jsonp({ error: 'Token is missing' });
  }
};

module.exports.checkAuthentication = function (req, res, next) {
  const myToken = req.query.token || req.body.token || req.headers['authorization'];
  
  if (myToken) {
    jwt.verify(myToken, "EngWebTP2024", function (err, payload) {
      if (err) {
        req.isAuthenticated = false;
      } else {
        req.isAuthenticated = true;
        req.user = payload;
      }
      next();
      return paylod
    });
  } else {
    req.isAuthenticated = false;
    next();
    return null
  }
};