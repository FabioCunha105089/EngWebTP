var express = require('express');
var router = express.Router();
var Entidade = require('../controllers/entidade')

// Listar ruas
router.get('/', function (req, res) {
  Entidade.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Consultar uma rua
router.get('/:nome', function (req, res) {
  Entidade.findByNome(req.params.nome)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Remover uma rua
router.delete('/:id', function (req, res) {
  Entidade.delete(req.params.id)
    .then(entidade => res.jsonp(entidade))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;