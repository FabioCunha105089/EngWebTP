var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/rua/')
  .then(resp => {
    console.log('entrou no index')
  })
  .catch(erro => console.log(erro))
});

module.exports = router;