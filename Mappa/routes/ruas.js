var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async function(req, res, next) {
  axios.get('http://localhost:3000/rua/')
  .then(resp => {
    res.render('list_ruas', {ruas : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:numero', function(req, res) {
  axios.get('http://localhost:3000/rua/' + req.params.numero)
  .then(resp => {
    var rua = resp.data
    axios.get('http://localhost:3000/comentario/rua/' + rua._id)
    .then(respC => res.render('rua', {rua : rua, comments : respC.data, isLoggedIn: res.locals.isLoggedIn}))
    .catch(erro => console.log(erro))
  })
  .catch(erro => console.log(erro))
})

module.exports = router;