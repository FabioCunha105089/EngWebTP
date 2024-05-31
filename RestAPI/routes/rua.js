var express = require('express');
var router = express.Router();
var Rua = require('../controllers/rua')

// Listar ruas
router.get('/', function (req, res) {
  Rua.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Consultar uma rua
router.get('/:id', function (req, res) {
  Rua.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Remover uma rua
router.delete('/:id', function (req, res) {
  Rua.delete(req.params.id)
    .then(rua => res.jsonp(rua))
    .catch(erro => res.jsonp(erro))
});

router.post('/', (req, res) => {
  const newRua = req.body
  Rua.insert(newRua)
    .then(resp => res.jsonp(resp))
    .catch(erro => res.jsonp(erro))
})

module.exports = router;
