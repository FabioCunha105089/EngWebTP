var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:3000/rua/')
  .then(resp => {
    res.render('list_ruas', {ruas : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:numero', function(req, res) {
  axios.get('http://localhost:3000/inforua/' + req.params.numero)
    .then(resp => {
      var rua = resp.data
      res.render('rua', {rua : rua})
    })
    .catch(erro => console.log(erro))
})

router.post('/:numero/comentario', async function(req, res) {
  try {
    const id = req.body.id

    const newComentario = {
      user: res.locals.user.name,
      comment: req.body.comentario,
      timestamp: new Date().toISOString().substring(0, 19)
    }

    const response = await axios.post('http://localhost:3000/inforua/comentario/' + id, newComentario)
    res.redirect('back')

  } catch (error) {
    console.error('Error forwarding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;