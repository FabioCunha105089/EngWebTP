var express = require('express');
var router = express.Router();
const axios = require('axios');

// Render the registration page
router.get('/registo', function(req, res) {
  res.render('registo');
});

// Handle registration form submission
router.post('/registo', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/user/register', {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    res.render('registoSucesso', { message: response.data.message });
  } catch (error) {
    res.render('registoFalhou', { error: error.response.data.error });
  }
});

// Render the login page
router.get('/login', function(req, res) {
  res.render('login');
});

// Handle login form submission
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/user/login', {
      username: req.body.username,
      password: req.body.password
    });
    // Store token in a session or cookie
    req.session.token = response.data.token;
    res.redirect('/ruas');
  } catch (error) {
    res.render('loginFalhou', { error: error.response.data.error });
  }
});

module.exports = router;