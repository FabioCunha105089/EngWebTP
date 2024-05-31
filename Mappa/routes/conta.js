var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs')
const libxmljs = require('libxmljs')
const {processFile} = require('../public/javascripts/xmlFuncs')
const multer = require('multer')
const path = require('path')

const upload = multer({ storage: multer.memoryStorage() });

router.get('/perfil', function (req, res) {
  res.render('perfil')
})

router.get('/perfil/:nome', function (req, res) {
  res.render('perfil')
})

// Render the registration page
router.get('/registo', function (req, res) {
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
router.get('/login', function (req, res) {
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

router.get('/sair', function (req, res) {
  req.session.token = null;
  res.redirect('/');
});

router.get('/add', function (req, res) {
  if (!res.locals.isLoggedIn)
    res.redirect('/conta/login')
  else if (res.locals.user.level == 3)
    res.render('error', { error: {}, message: 'Não tem permissões para aceder a esta página' })
  else
    res.render('adicionarRua', {failed: null}) 
})

router.post('/add/upload', upload.single('file'), async function (req, res) {
  if (!res.locals.isLoggedIn)
    res.redirect('/conta/login')
  else if (res.locals.user.level == 3)
    res.render('error', { error: {}, message: 'Não tem permissões para aceder a esta página' })
  else
    try {
      const xmlContent = req.file.buffer.toString('utf-8')
      const xmlDoc = libxmljs.parseXml(xmlContent);
      const xsdPath = path.join(__dirname, '../xml/MRB-rua.xsd')
      const xsdDoc = libxmljs.parseXml( fs.readFileSync(xsdPath, 'utf8') );

      if (xmlDoc.validate(xsdDoc)) {
        const rua = processFile(xmlContent)
        axios.post('http://localhost:3000/inforua/', rua, {headers : {'Content-Type': 'application/json'}})
        .then(resp => {
          axios.post('http://localhost:3000/rua/', {_id: rua._id, nome: rua.nome}, {headers : {'Content-Type': 'application/json'}})
          .then(ruaresp => res.render('adicionarRua', {failed : false}))
          .catch(erro => {console.log(erro)})
        })
        .catch(erro => {console.log(erro)})
      }
      else {
        xmlDoc.validationErrors.forEach(error => console.log(`Line ${error.line}: ${error.message}`))
        res.render('adicionarRua', {failed: true})
      }
    } catch(error) {
      console.error('Erro:', error.message)
    }
})

module.exports = router;
