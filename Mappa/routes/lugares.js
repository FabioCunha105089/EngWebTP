var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:3000/lugar/')
  .then(resp => {
    res.render('list_lugares', {lugares : resp.data})
  })
  .catch(erro => console.log(erro))
});

router.get('/:nome', function(req, res) {
  axios.get('http://localhost:3000/lugar/' + req.params.nome)
    .then(resp => {
      var lugar = resp.data;
      var ruaPromises = [];

      for (const rua_id of lugar.ruas) {
        ruaPromises.push(
          axios.get('http://localhost:3000/rua/' + rua_id)
            .then(resp_rua => resp_rua.data)
            .catch(erro => {
              console.log(erro);
              return null;
            })
        );
      }

      Promise.all(ruaPromises)
        .then(ruas => {
          console.log(ruas)
          ruas = ruas.filter(rua => rua !== null);
          res.render('lugar', { lugar: lugar, ruas: ruas });
        })
        .catch(erro => {
          console.log(erro);
          res.status(500).send('Error retrieving ruas');
        });
    })
    .catch(erro => {
      console.log(erro);
      res.status(500).send('Error retrieving lugar');
    });
});

module.exports = router;