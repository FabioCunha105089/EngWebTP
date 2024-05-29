var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/lugar/')
  .then(resp => {
    res.render('list_lugares', {lugares : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:nome', function(req, res) {
  axios.get('http://localhost:3000/entidades?lugar=' + req.params.nome)
  .then(resp => {
    var lugar = resp.data[0]
    axios.get('http://localhost:3000/rua?_id=' + lugar.rua)
    .then(resp_rua => res.render('lugar', {lugar : lugar, rua : resp_rua.data[0]}))
    .catch(erro => console.log(erro))
  })
  .catch(erro => console.log(erro))
})

module.exports = router;