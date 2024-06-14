const mongoose = require('mongoose')

var sugestaoSchema = new mongoose.Schema({
  username: String,
  sugestao: String,
  creationDate: String,
});

var sugestoesRuaSchema = new mongoose.Schema({
  rua: Number,
  nome: String,
  sugestoes: [sugestaoSchema]
}, { _id: false });

module.exports = mongoose.model('sugestao', sugestoesRuaSchema, 'sugestoes')