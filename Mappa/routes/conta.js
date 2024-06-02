var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')
var path = require('path')
var fs = require('fs')
var multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() });

router.get('/perfil', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/user/' + res.locals.user.username)
    const utilizador = response.data.user

    var profilePicPath = path.join('/pfpics/', `${utilizador.username}.jpg`);
    const hasProfilePic = fs.existsSync(profilePicPath);
    if (!hasProfilePic)
      profilePicPath = path.join('/pfpics/', '__NOPIC__.jpg')

    res.render('perfil', { utilizador: utilizador, pfpPath : profilePicPath})
  }
  catch (error) {
    console.error('Erro a obter informação do user:', error);
    res.render('error', { error: error });
  }
})

router.get('/perfil/:id', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/user/' + req.params.id)
    const utilizador = response.data.user
    res.render('perfilOutro', { utilizador: utilizador })
  } catch (error) {
    console.log(error);
    res.render('error', { error: error.response.data.error });
  }
})

router.get('/edit', Auth.requireAuthentication(1), function (req, res) {
  var profilePicPath = path.join('/pfpics/', `${res.locals.user.username}.jpg`);
  const hasProfilePic = fs.existsSync(profilePicPath);
  if (!hasProfilePic)
    profilePicPath = ''
  res.render('edit_perfil', {user : res.locals.user, pfpPath : profilePicPath})
})


router.post('/edit', Auth.requireAuthentication(1), upload.fields([{name : 'pfp', maxCount: 1}]), function (req, res) {
  /*
  const newUser = req.body
  newUser['_id'] = req.body.username
  if (req.body.password === '')
    delete newUser.password
  console.log(newUser)
  axios.put('http://localhost:3000/user/' + res.locals.user._id, newUser, { 
    headers: { 
      'Content-Type': 'application/json'
    }})
    
  .then(resp => {
      console.log(resp)
      res.render('index')
    })
  .catch(error => res.render('error', {error : error, message : error.message}))
  */
  if (req.body.pfp) {
    const savePath = __dirname.slice(0, -6) + 'public/pfpics/' + res.locals.user.username
    fs.writeFileSync(savePath, req.files['pfp'][0].buffer);
  }
  res.render('perfil', {utilizador : res.locals.user})
})

router.get('/registo', function (req, res) {
  res.render('registo');
});

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

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/user/login', {
      username: req.body.username,
      password: req.body.password
    });
    // Guardar token na session
    req.session.user = response.data.user
    req.session.token = response.data.token;
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('loginFalhou', { error: error.response.data.error });
  }
});

router.get('/sair', function (req, res) {
  req.session.token = null;
  req.session.user = null
  res.redirect('/');
});

// Trocar nível de user
router.post('/:id/change-level', Auth.requireAuthentication(3), async (req, res) => {
  const id = req.params.id;
  const level = req.body.level;

  try {
    await axios.put(`http://localhost:3000/user/${id}/change-level`, { level });

    res.redirect('back');
  } catch (error) {
    console.error('Error changing user level:', error);

    res.render('error', { error: error, message: 'Erro na alteração do nível do utilizador' });
  }
});

router.post('/:id/delete', Auth.requireAuthentication(3), async (req, res) => {
  const userId = req.params.id;

  try {
    await axios.delete(`http://localhost:3000/user/${userId}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
