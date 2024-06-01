const jwt = require('jsonwebtoken');

module.exports.requireAuthentication = function (req, res, next) {
  const myToken = req.session.token;
  
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
    return res.redirect('/conta/login')
  }
};

module.exports.checkAuthentication = function (req, res, next) {
  const myToken = req.session.token;
  
  if (myToken) {
    jwt.verify(myToken, "EngWebTP2024", function (err, payload) {
      if (err) {
        req.isAuthenticated = false;
      } else {
        req.isAuthenticated = true;
        req.user = payload;
      }
      next();
    });
  } else {
    req.isAuthenticated = false;
    next();
  }
};