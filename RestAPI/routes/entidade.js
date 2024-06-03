var express = require('express');
var router = express.Router();
var Entidade = require('../controllers/entidade')

router.get('/', function (req, res) {
  Entidade.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.get('/:nome', function (req, res) {
  Entidade.findByNome(req.params.nome)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;