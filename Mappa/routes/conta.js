var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')
const fs = require('fs')
const libxmljs = require('libxmljs')
const { processFile } = require('../public/javascripts/xmlFuncs')
const multer = require('multer')
const path = require('path')

const upload = multer({ storage: multer.memoryStorage() });

router.get('/perfil', Auth.requireAuthentication(1), async function (req, res) {
  const response = await axios.get('http://localhost:3000/user/' + res.locals.user.username)
  const utilizador = response.data.user
  res.render('perfil', { utilizador: utilizador })
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

router.get('/add', Auth.requireAuthentication(2), function (req, res) {
  res.render('adicionarRua', { failed: null })
})

router.post('/add/upload', Auth.requireAuthentication(2), upload.single('file'), async function (req, res) {
  try {
    const xmlContent = req.file.buffer.toString('utf-8')
    const xmlDoc = libxmljs.parseXml(xmlContent);
    const xsdPath = path.join(__dirname, '../xml/MRB-rua.xsd')
    const xsdDoc = libxmljs.parseXml(fs.readFileSync(xsdPath, 'utf8'));

    if (xmlDoc.validate(xsdDoc)) {
      const rua = processFile(xmlContent)
      axios.post('http://localhost:3000/inforua/', rua, { headers: { 'Content-Type': 'application/json' } })
        .then(resp => {
          axios.post('http://localhost:3000/rua/', { _id: rua._id, nome: rua.nome }, { headers: { 'Content-Type': 'application/json' } })
            .then(ruaresp => res.render('adicionarRua', { failed: false }))
            .catch(erro => { console.log(erro) })
        })
        .catch(erro => { console.log(erro) })
    }
    else {
      xmlDoc.validationErrors.forEach(error => console.log(`Line ${error.line}: ${error.message}`))
      res.render('adicionarRua', { failed: true })
    }
  } catch (error) {
    console.error('Erro:', error.message)
  }
})

module.exports = router;
