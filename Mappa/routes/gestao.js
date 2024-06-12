var express = require('express');
var router = express.Router();
var axios = require('axios')
const Auth = require('../auth/auth')
const fs = require('fs')
const libxmljs = require('libxmljs')
const { processFile } = require('../public/javascripts/xmlFuncs')
const multer = require('multer')
const path = require('path')
const JSZip = require('jszip')

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

router.get('/sugestoes', Auth.requireAuthentication(2), function (req, res, next) {
  axios.get('http://rest-api:3000/gestao/sugestoes')
    .then(resp => {
      res.render('list_sugestoes', { sugestoes: resp.data });
    })
    .catch(error => {
      res.render('error', { error: error })
    })
});

router.get('/rua/:id', Auth.requireAuthentication(2), async function (req, res, next) {
  try {
    const respRua = await axios.get('http://rest-api:3000/inforua/' + req.params.id)
    const respSugestoes = await axios.get('http://rest-api:3000/gestao/sugestoes/' + req.params.id)
    const ruaTexto = JSON.stringify(respRua.data, null, 2)

    res.render('edit_rua', { sugestoes: respSugestoes.data.sugestoes, texto: ruaTexto, nome: respRua.data.nome, id: req.params.id })

  } catch (error) {
    res.render('error', { error: error })
  }
});

router.post('/rua/:id', Auth.requireAuthentication(2), async function (req, res) {
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

router.post('/add/upload', Auth.requireAuthentication(2), upload.single('file'), async (req, res) => {
  try {
    const zip = await JSZip.loadAsync(req.file.buffer);
    let hasXmlFile = false;
    let hasImages = false
    let rua = null;

    // Verifica se existe um ficheiro XML e imagens
    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.name.endsWith('.xml')) {
        hasXmlFile = true;
      }
      if (zipEntry.name.match(/\.(jpg|jpeg|png)$/i)) {
        hasImages = true
      }
    });

    // Erro se não existir XML
    if (!hasXmlFile) {
      return res.render('adicionarRua', { failed: true, mensagem_erro: "Não existe ficheiro XML no zip" });
    }

    // Processa o ficheiro XML para poder guardar as imagens
    for (const relativePath in zip.files) {
      const zipEntry = zip.files[relativePath];
      if (zipEntry.name.endsWith('.xml')) {
        const content = await zipEntry.async('nodebuffer');
        const xmlContent = content.toString('utf-8');
        const xmlDoc = libxmljs.parseXml(xmlContent);
        const xsdPath = path.join(__dirname, '../xml/MRB-rua.xsd');
        const xsdDoc = libxmljs.parseXml(fs.readFileSync(xsdPath, 'utf8'));

        // Validação com o XSD
        if (xmlDoc.validate(xsdDoc)) {
          rua = processFile(xmlContent);
          const xmlSavePath = path.join(__dirname, '../public/uploads/', zipEntry.name);
          fs.writeFileSync(xmlSavePath, content);

          // Posts
          await axios.post('http://localhost:3000/inforua/', rua, { headers: { 'Content-Type': 'application/json' } });
          await axios.post('http://localhost:3000/rua/', { _id: rua._id, nome: rua.nome }, { headers: { 'Content-Type': 'application/json' } });
        } else {
          const erros = xmlDoc.validationErrors.map(error => error.message).join('\n');
          throw new Error(erros);
        }
        break;
      }
    }

    // Processa imagens
    const filePromises = [];
    if (hasImages) {
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.name.endsWith('.xml')) {
          const filePromise = zipEntry.async('nodebuffer').then(content => {
            if (zipEntry.name.match(/\.(jpg|jpeg|png)$/i)) {
              const savePath = path.join(__dirname, '../public/images/', zipEntry.name);
              fs.writeFileSync(savePath, content);
              if (rua) {
                rua.figuras.push({ path: '/images/' + zipEntry.name });
              }
            }
          });
          filePromises.push(filePromise);
        }
      });
    }

    await Promise.all(filePromises);
    res.render('adicionarRua', { failed: false });
  } catch (error) {
    console.error('Erro:', error.message);
    res.render('adicionarRua', { failed: true, mensagem_erro: error.message });
  }
});

module.exports = router;