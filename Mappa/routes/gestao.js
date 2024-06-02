var express = require('express');
var router = express.Router();
var axios = require('axios')
const Auth = require('../auth/auth')
const fs = require('fs')
const libxmljs = require('libxmljs')
const { processFile } = require('../public/javascripts/xmlFuncs')
const multer = require('multer')
const path = require('path')

const upload = multer({ storage: multer.memoryStorage() });

/* GET home page. */
router.get('/', Auth.requireAuthentication(2), function (req, res, next) {
  res.render('gestao');
});

router.get('/utilizadores', Auth.requireAuthentication(3), function (req, res, next) {
  axios.get('http://rest-api:3000/user')
    .then(resp => {
      if (req.query.username) {
        const user_list = resp.data.filter(user => user.username.toLowerCase().includes(req.query.username.toLowerCase()));
        res.render('list_users', { users: user_list });
      }
      else {
        console.log(resp.data);
        res.render('list_users', { users: resp.data });
      }

    })
    .catch(error => {
      res.render('error', { error: error })
    })
});

router.get('/sugestoes', Auth.requireAuthentication(2), function(req, res, next) {
  axios.get('http://rest-api:3000/gestao/sugestoes')
    .then( resp => {
      res.render('list_sugestoes', { sugestoes : resp.data});
    })
    .catch(error => {
      res.render('error', {error: error})
    })
});

router.get('/rua/:id', Auth.requireAuthentication(2), async function(req, res, next) {
  try{
    const respRua = await axios.get('http://rest-api:3000/inforua/' + req.params.id)
    const respSugestoes = await axios.get('http://rest-api:3000/gestao/sugestoes/' + req.params.id)
    const ruaTexto = JSON.stringify(respRua.data, null, 2)

    res.render('edit_rua', { sugestoes: respSugestoes.data.sugestoes, texto: ruaTexto, nome: respRua.data.nome, id : req.params.id})

  }catch(error) {
      res.render('error', {error: error})
  }
});

router.post('/rua/:id', Auth.requireAuthentication(2), async function(req, res) {
  try {
    const id = req.params.id;
    const updatedTexto = JSON.parse(req.body.ruaTexto);
    let sugestoesAceites = [];
    let sugestoesRecusadas = [];

    if (req.body.sugestoesAceites)
      sugestoesAceites = JSON.parse(req.body.sugestoesAceites);
    if (req.body.sugestoesRecusadas)
      sugestoesRecusadas = JSON.parse(req.body.sugestoesRecusadas);

    await axios.put('http://rest-api:3000/inforua/' + id, { updatedTexto });

    if (sugestoesAceites.length > 0) {
      await Promise.all(sugestoesAceites.map(async (s) => {
        await axios.delete(`http://rest-api:3000/gestao/sugestao/${s.sId}/rua/${id}`);
        await axios.put(`http://rest-api:3000/user/${s.username}/sugestao`);
      }));
    }
    if (sugestoesRecusadas.length > 0) {
      await Promise.all(sugestoesRecusadas.map(async (s) => {
        await axios.delete(`http://rest-api:3000/gestao/sugestao/${s.sId}/rua/${id}`);
      }));
    }

    res.redirect(`/ruas/${id}`);

  } catch (error) {
    console.error('Error updating Rua:', error);
    res.render('error', { error: error });
  }
});

router.get('/add', Auth.requireAuthentication(2), function (req, res) {
  res.render('adicionarRua', { failed: null })
})

router.post('/add/upload', Auth.requireAuthentication(2), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'images', maxCount: 12 }]), async function (req, res) {
  try {
    const xmlFile = req.files['file'][0]
    const xmlContent = xmlFile.buffer.toString('utf-8')
    const xmlDoc = libxmljs.parseXml(xmlContent);
    const xsdPath = path.join(__dirname, '../xml/MRB-rua.xsd')
    const xsdDoc = libxmljs.parseXml(fs.readFileSync(xsdPath, 'utf8'));

    if (xmlDoc.validate(xsdDoc)) {
      const rua = processFile(xmlContent);

      if (rua.figuras != null && req.files['images'] && rua.figuras.length <= req.files['images'].length) {
        var i = 0
        console.log(req.files['images'])
        for (const image of req.files['images']) {
          const savePath = __dirname.slice(0, -6) + 'public/images/' + image.originalname
          fs.writeFileSync(savePath, image.buffer);
          rua.figuras[i++].path = '/images/' + image.originalname
        }
      }

      const xmlSavePath = path.join(__dirname, '../public/uploads/', xmlFile.originalname);
      fs.writeFileSync(xmlSavePath, xmlFile.buffer);

      await axios.post('http://localhost:3000/inforua/', rua, { headers: { 'Content-Type': 'application/json' } });
      await axios.post('http://localhost:3000/rua/', { _id: rua._id, nome: rua.nome }, { headers: { 'Content-Type': 'application/json' } });

      res.render('adicionarRua', { failed: false });
    }
    else {
      var erros = ''
      xmlDoc.validationErrors.forEach(error => erros += error.message)
      res.render('adicionarRua', { failed: true, mensagem_erro: erros })
    }
  } catch (error) {
    console.error('Erro:', error.message)
    res.render('adicionarRua', { failed: true, mensagem_erro: error.message })
  }
})

module.exports = router;