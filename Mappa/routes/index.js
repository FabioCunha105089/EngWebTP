var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/rua/')
  .then(resp => {
    res.render('index', {ruas : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:numero', function(req, req) {
  axios.get('http://localhost:3000/rua?_id=' + req.params.numero)
  .then(resp => res.render('rua', {rua : resp.data}))
  .catch(erro => console.log(erro))
})

module.exports = router;