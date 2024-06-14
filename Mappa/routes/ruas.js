var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth.js')

function isInRuaList(rua_list, new_rua) {
  return rua_list.some(rua => rua._id === new_rua);
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const resp = await axios.get('http://rest-api:3000/rua/');
    let rua_list = resp.data;

    // Verifica se foi feita uma pesquisa
    if (req.query.nome) {
      //Remove todas as ruas que não contem o que foi procurado
      rua_list = rua_list.filter(rua => rua.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
      const query_formatted = req.query.nome.toUpperCase().split(' ').join('_');
      const outras_ruas = new Set();

      //Verifica se foi procurado uma entidade
      try {
        const entidadeResp = await axios.get('http://rest-api:3000/entidade/' + query_formatted);
        const entidade = entidadeResp.data;

        if (entidade) {
          for (let ent_info of entidade.info) {
            outras_ruas.add(parseInt(ent_info.numero, 10));
          }
        }
      } catch (erro) {
        console.log(erro);
      }

      // Verifica se foi procurado um lugar
      try {
        const lugarResp = await axios.get('http://rest-api:3000/lugar/' + query_formatted);
        const lugar = lugarResp.data;

        if (lugar) {
          lugar.ruas.map(str => outras_ruas.add(parseInt(str, 10)));
        }
      } catch (erro) {
        console.log(erro);
      }

      // Adiciona ruas se foi procurado uma entidade/lugar
      for (let r of outras_ruas) {
        if (!isInRuaList(rua_list, r)) {
          try {
            const ruaResp = await axios.get('http://rest-api:3000/rua/' + r);
            rua_list.push(ruaResp.data);
          } catch (erro) {
            console.log(erro);
          }
        }
      }
    }

    res.render('list_ruas', { ruas: rua_list });
  } catch (erro) {
    console.log(erro);
    next(erro);
  }
});

router.get('/:numero', function (req, res) {
  axios.get('http://rest-api:3000/inforua/' + req.params.numero)
    .then(resp => {
      var rua = resp.data
      res.render('rua', { rua: rua })
    })
    .catch(erro => console.log(erro))
})

router.post('/:numero/comentario', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const id = req.body.id

    const newComentario = {
      user: res.locals.user.name,
      comment: req.body.comentario,
      timestamp: new Date().toISOString().substring(0, 19)
    }

    await axios.post('http://rest-api:3000/inforua/comentario/' + id, newComentario)
    res.redirect('back')

  } catch (error) {
    console.error('Error forwarding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/sugestao', Auth.requireAuthentication(1), async function (req, res) {
  try {
    const id = req.params.id;
    const { nome, sugestao } = req.body;
    const novaSugestao = {
      username: res.locals.user.username,
      sugestao: sugestao,
      creationDate: new Date().toISOString().substring(0, 19)
    }

    await axios.post('http://rest-api:3000/inforua/sugestao/' + id, { nome, novaSugestao })
    res.redirect('back')

  } catch (error) {
    console.error('Error forwarding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;