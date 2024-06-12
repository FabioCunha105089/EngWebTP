var express = require('express');
var router = express.Router();
var infoRua = require('../controllers/inforua')
var Sugestoes = require('../controllers/sugestao')

// Consultar uma rua
router.get('/:id', function (req, res) {
  infoRua.findById(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

// Adicionar comentário
router.post('/comentario/:id', async function (req, res) {
  try {
    const id = req.params.id
    const rua = await infoRua.findById(id);
    if (!rua) {
      return res.status(404).send('InfoRua not found');
    }

    const novoComentario = req.body;

    rua.comentarios.push(novoComentario);
    await rua.save();

    res.status(200).send('Comentário adicionado com sucesso.');

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Adicionar sugestao
router.post('/sugestao/:id', async function (req, res) {
  try {
    const id = req.params.id
    const { nome, novaSugestao } = req.body;

    await Sugestoes.addSugestao(id, nome, novaSugestao)
    res.status(200).send('Sugestão adicionada com sucesso.');

  } catch (error) {
    console.error('Erro ao adicionar sugestão:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Remover uma rua
router.delete('/:id', function (req, res) {
  infoRua.delete(req.params.id)
    .then(rua => res.jsonp(rua))
    .catch(erro => res.jsonp(erro))
});

router.post('/', function (req, res) {
  infoRua.insert(req.body)
    .then(rua => res.jsonp(rua))
    .catch(erro => res.jsonp(erro))
})

router.put('/:id', async function (req, res) {
  try {
    const id = req.params.id;
    const updateData = req.body.updatedTexto;
    const updatedDocument = await infoRua.update(id, updateData);

    if (!updatedDocument) {
      return res.status(404).send('InfoRua not found');
    }

    res.status(200).json(updatedDocument);

  } catch (error) {
    console.error('Error updating InfoRua:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
