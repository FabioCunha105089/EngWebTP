var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  axios.get('http://rest-api:3000/rua/')
    .then(resp => {
      if (req.query.nome) {
        const rua_list = resp.data.filter(rua => rua.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
        res.render('list_ruas', { ruas: rua_list });
      } else {
        console.log(resp.data)
        res.render('list_ruas', { ruas: resp.data })
      }
    })
    .catch(erro => console.log(erro))
});

router.get('/:numero', function (req, res) {
  axios.get('http://rest-api:3000/inforua/' + req.params.numero)
    .then(resp => {
      var rua = resp.data
      res.render('rua', { rua: rua })
    })
    .catch(erro => console.log(erro))
})

router.post('/:numero/comentario', Auth.requireAuthentication(1), async function(req, res) {
  try {
    const id = req.body.id

    const newComentario = {
      user: res.locals.user.name,
      comment: req.body.comentario,
      timestamp: new Date().toISOString().substring(0, 19)
    }

    await axios.post('http://rest-api:3000/inforua/comentario/' + id, newComentario)
    res.redirect('back')

  } catch (error) {
    console.error('Error forwarding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/sugestao', Auth.requireAuthentication(1), async function(req, res) {
  try {
    const id = req.params.id;
    const { nome, sugestao } = req.body;
    const novaSugestao = {
      username: res.locals.user.username,
      sugestao: sugestao,
      creationDate: new Date().toISOString().substring(0, 19)
    }

    await axios.post('http://rest-api:3000/inforua/sugestao/' + id, { nome, novaSugestao })
    res.redirect('back')

  } catch (error) {
    console.error('Error forwarding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;