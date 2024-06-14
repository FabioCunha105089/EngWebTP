var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')
var fs = require('fs')
var multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() });

router.get('/perfil', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const response = await axios.get('http://rest-api:3000/user/' + res.locals.user.username)
    const utilizador = response.data.user

    res.render('perfil', { utilizador: utilizador })
  }
  catch (error) {
    console.error('Erro a obter informação do user:', error);
    res.render('error', { error: error });
  }
})

router.get('/perfil/:id', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const response = await axios.get('http://rest-api:3000/user/' + req.params.id)
    const utilizador = response.data.user
    res.render('perfilOutro', { utilizador: utilizador })
  } catch (error) {
    console.log(error);
    res.render('error', { error: error.response.data.error });
  }
})

router.get('/edit', Auth.requireAuthentication(1), async function (req, res) {
  const response = await axios.get('http://rest-api:3000/user/' + req.session.user._id)
  const utilizador = response.data.user
  res.render('edit_perfil', {utilizador : utilizador })
})


router.post('/edit', Auth.requireAuthentication(1), upload.fields([{name : 'pfp', maxCount: 1}]), async function (req, res) {
  try {
    let path;
    if (req.files['pfp'] != null) {
      const savePath = __dirname.slice(0, -6) + 'pfpics/' + res.locals.user.username + '.jpg';
      fs.writeFileSync(savePath, req.files['pfp'][0].buffer);
      path = `/../pfpics/${req.session.user.username}.jpg`;
    }

    const userId = req.session.user._id;
    await axios.put('http://rest-api:3000/user/edit', {
      userId,
      path,
      ...req.body
    });

    res.redirect('/conta/perfil');

  } catch (error) {
    console.error(error);
    res.render('editFalhou', {error: error.response.data.error })
  }
  })

router.get('/registo', function (req, res) {
  res.render('registo');
});

router.post('/registo', async (req, res) => {
  try {
    const response = await axios.post('http://rest-api:3000/user/register', {
      username: req.body.username,
      name: req.body.name,
      foto: "/../pfpics/__NOPIC__.jpg",
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
    const response = await axios.post('http://rest-api:3000/user/login', {
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
    await axios.put(`http://rest-api:3000/user/${id}/change-level`, { level });

    res.redirect('back');
  } catch (error) {
    console.error('Error changing user level:', error);

    res.render('error', { error: error, message: 'Erro na alteração do nível do utilizador' });
  }
});

router.post('/:id/delete', Auth.requireAuthentication(3), async (req, res) => {
  const userId = req.params.id;

  try {
    await axios.delete(`http://rest-api:3000/user/${userId}`);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
