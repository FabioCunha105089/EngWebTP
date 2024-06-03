var express = require('express');
var router = express.Router();
var Lugar = require('../controllers/lugar')

router.get('/', function (req, res) {
  Lugar.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.get('/:nome', function (req, res) {
  Lugar.findByNome(req.params.nome)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;