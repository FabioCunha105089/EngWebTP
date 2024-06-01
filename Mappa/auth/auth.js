const jwt = require('jsonwebtoken');
const authLevelMapping = {
  "Consumidor": 1,
  "Produtor": 2,
  "Administrador": 3
};

module.exports.requireAuthentication = function (requiredLevel) {
  return function (req, res, next) {
    const myToken = req.session.token;

    if (myToken) {
      jwt.verify(myToken, "EngWebTP2024", function (err, payload) {
        if (err) {
          req.session.token = null;
          req.session.user = null;
          return res.redirect('/conta/login')
        } else {
          req.user = payload;

          const userAuthLevel = authLevelMapping[req.session.user.level];

          if (userAuthLevel < requiredLevel) {
            return res.status(403).send('You do not have the required permissions');
          }
          next();
        }
      });
    } else {
      return res.redirect('/conta/login')
    }
  }
}
