var express = require('express');
var router = express.Router();
var userModel = require('../models/user')
var passport = require('passport');
var jwt = require('jsonwebtoken')
var User = require('../controllers/user')

router.get('/', function (req, res) {
  User.list()
    .then(list => res.status(200).jsonp(list))
    .catch(e => res.status(500).jsonp({ error: e }))
})

router.get('/:id', function (req, res) {
  User.findById(req.params.id)
    .then(user => res.status(200).jsonp({ user }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

router.post('/register', function (req, res) {
  var d = new Date().toISOString().substring(0, 19);
  userModel.register(new userModel({
    _id: req.body.username,
    username: req.body.username,
    name: req.body.name,
    foto: req.body.foto,
    email: req.body.email,
    level: "Administrador",
    registrationDate: d,
    sugestoesAceites: 0
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).jsonp({ error: err, message: "Register error: " + err });
    } else {
      res.status(201).jsonp({ message: "User registered successfully" });
    }
  });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.status(500).jsonp({ error: "Authentication error: " + err });
    }
    if (!user) {
      return res.status(401).jsonp({ error: "Invalid credentials" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).jsonp({ error: "Login error: " + err });
      }
      
      // Update lastAccess attribute
      user.lastAccess = new Date().toISOString().substring(0, 19);
      user.save()
        .then(() => {
          // Generate JWT token
          jwt.sign({
            username: user.username,
            level: user.level,
            sub: 'login'
          }, "EngWebTP2024", { expiresIn: 3600 }, function (e, token) {
            if (e) {
              res.status(500).jsonp({ error: "Error generating token: " + e });
            } else {
              res.status(200).jsonp({ token: token, user : user });
            }
          });
        })
        .catch(saveErr => {
          res.status(500).jsonp({ error: "Error updating lastAccess: " + saveErr });
        });
    });
  })(req, res, next);
});

router.put('/edit', async function (req, res) {
  try {
    const { userId, path, name, email, oldPassword, newPassword, confirmPassword } = req.body;
    console.log(req.body);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (path) user.foto = path;

    if (oldPassword && newPassword && confirmPassword) {
      await user.changePassword(oldPassword, newPassword);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error: ' + error });
  }
});


router.put('/:id/change-level', function (req, res) {
  console.log(req.body.level);
  User.updateUserLevel(req.params.id, req.body.level)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na alteração do utilizador" })
    })
})

router.delete('/:id', function (req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', { error: erro, message: "Erro na remoção do utilizador" })
    })
})

router.put('/:id/sugestao', function(req, res) {
  User.updateUserSuggestions(req.params.id)
    .then(dados => {res.jsonp(dados)})
    .catch(error => {
      res.render('error', { error: error, message: "Erro a atualiza sugestões aceites" })
    })
})
module.exports = router;