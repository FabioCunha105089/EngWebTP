var express = require('express');
var router = express.Router();
var Sugestoes = require('../controllers/sugestao')

router.get('/sugestoes', function (req, res) {
  Sugestoes.list()
    .then(data => res.jsonp(data))
    .catch(erro => {
      console.log(erro);
      res.jsonp(erro)})
});

router.get('/sugestoes/:id', function (req, res) {
  Sugestoes.sugestoesRua(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => {
      console.log(erro);
      res.jsonp(erro)})
});

router.delete('/sugestao/:sId/rua/:id', function (req, res) {
  Sugestoes.deleteSugestao(req.params.id, req.params.sId)
    .then(rua => res.jsonp(rua))
    .catch(erro => res.jsonp(erro))
});

router.post('/dsadsa', (req, res) => {
  const newRua = req.body
  Sugestoes.insert(newRua)
    .then(resp => res.jsonp(resp))
    .catch(erro => res.jsonp(erro))
})

module.exports = router;
