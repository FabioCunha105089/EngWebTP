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
router.get('/:id', function (req, res) {
  Entidade.findById(req.params.id)
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