var express = require('express');
var router = express.Router();
var Lugar = require('../controllers/lugar')

// Listar ruas
router.get('/', function (req, res) {
  Lugar.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Consultar uma rua
router.get('/:nome', function (req, res) {
  Lugar.findByNome(req.params.nome)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Remover uma rua
router.delete('/:id', function (req, res) {
  Lugar.delete(req.params.id)
    .then(lugar => res.jsonp(lugar))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;