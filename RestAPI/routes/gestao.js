var express = require('express');
var router = express.Router();
var Sugestoes = require('../controllers/sugestao')

router.get('/sugestoes', function (req, res) {
  Sugestoes.list()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.delete('/sugestoes/:id', function (req, res) {
  Sugestoes.delete(req.params.id)
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
