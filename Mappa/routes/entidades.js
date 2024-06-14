var express = require('express');
var router = express.Router();
const axios = require('axios');

function fixEntidadesName(entidades) {
  var fixed_names = []
  entidades.forEach(element => {
    fixed_names.push(element.nome.replace(/_/g, ' '))
  });
  return fixed_names
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  axios.get('http://rest-api:3000/entidade/')
    .then(resp => {
      if (req.query.nome) {
        const entidade_list = resp.data.filter(entidade => entidade.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
        res.render('list_entidades', { entidades: entidade_list, nomes: fixEntidadesName(entidade_list) });
      }
      res.render('list_entidades', { entidades: resp.data, nomes: fixEntidadesName(resp.data) })
    })
    .catch(erro => console.log(erro))
});

router.get('/:nome', function (req, res) {
  axios.get('http://rest-api:3000/entidade/' + req.params.nome)
    .then(async resp => {
      var entidade = resp.data
      entidade.nome = entidade.nome.replace(/_/g, ' ')
      var rua_list = []
      for (ent_info of entidade.info) {
        rua_list.push(await axios.get('http://rest-api:3000/rua/' + parseInt(ent_info.numero, 10)))
      }
      console.log(rua_list)
      res.render('entidade', { entidade: resp.data, ruas: rua_list })
    })
    .catch(erro => console.log(erro))
})

module.exports = router;