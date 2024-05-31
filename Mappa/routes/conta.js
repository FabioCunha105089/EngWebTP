var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')

router.get('/perfil', Auth.requireAuthentication, function(req, res) {
  res.render('perfil')
})

router.get('/perfil/:id', async function(req, res) {
  try {
    const response = await axios.get('http://localhost:3000/user/' + req.params.id)
    const utilizador = response.data.user
    console.log(utilizador);
    res.render('perfilOutro', { utilizador : utilizador})
  } catch (error) {
    console.log(error);
    res.render('error', {error: error.response.data.error});
  }
})

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
    req.session.user = response.data.user
    req.session.token = response.data.token;
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('loginFalhou', { error: error.response.data.error });
  }
});

router.get('/sair', Auth.requireAuthentication, function(req, res) {
  req.session.token = null;
  req.session.user = null
  res.redirect('/');
});

// Route to handle changing user level
router.post('/:id/change-level', async (req, res) => {
  const id = req.params.id;
  const level = req.body.level;

  try {
    // Sending the level data in the request body
    const response = await axios.put(`http://localhost:3000/user/${id}/change-level`, { level });
    
    // Redirecting back to the previous page
    res.redirect('back');
  } catch (error) {
    console.error('Error changing user level:', error);
    
    // Handling errors and rendering an error page
    res.render('error', { error: error, message: 'Erro na alteração do nível do utilizador' });
  }
});

// Express route to handle user deletion
router.post('/:id/delete', async (req, res) => {
  const userId = req.params.id;
  
  try {
    // Make a DELETE request to the REST API endpoint
    await axios.delete(`http://localhost:3000/user/${userId}`);
    
    // Redirect to some page after successful deletion
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
