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
  console.log('http://localhost:3000/lugar/' + req.params.nome)
  axios.get('http://localhost:3000/lugar/' + req.params.nome)
    .then(resp => {
      var lugar = resp.data;
      var ruaPromises = [];
      
      for (const rua_id of lugar.ruas) {
        ruaPromises.push(
          axios.get('http://localhost:3000/rua/' + rua_id)
            .then(resp_rua => resp_rua.data[0])
            .catch(erro => {
              console.log(erro);
              return null; // Handle error, possibly pushing a null to maintain list length
            })
        );
      }

      Promise.all(ruaPromises)
        .then(ruas => {
          // Filter out any null responses if error handling was done above
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