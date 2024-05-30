var mongoose = require('mongoose')

var ruaSchema = new mongoose.Schema({
  _id: String,
  nome: String
})

module.exports = mongoose.model('rua', ruaSchema)