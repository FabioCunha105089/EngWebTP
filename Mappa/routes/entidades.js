var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/entidade/')
  .then(resp => {
    if (req.query.nome) {
      const entidade_list = resp.data.filter(entidade => entidade.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
      res.render('list_entidades', { entidades: entidade_list });
    }
    res.render('list_entidades', {entidades : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:nome', function(req, res) {
  axios.get('http://localhost:3000/entidade/' + req.params.nome)
  .then(resp => res.render('entidade', {entidade : resp.data}))
  .catch(erro => console.log(erro))
})

module.exports = router;