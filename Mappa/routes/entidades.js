var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/entidade/')
  .then(resp => {
    res.render('list_entidades', {entidades : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:nome', function(req, res) {
  axios.get('http://localhost:3000/entidade?nome=' + req.params.nome)
  .then(resp => res.render('entidade', {entidade : resp.data[0]}))
  .catch(erro => console.log(erro))
})

module.exports = router;