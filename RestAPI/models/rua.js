var mongoose = require('mongoose')

var ruaSchema = new mongoose.Schema({
  _id: Number,
  nome: String
})

module.exports = mongoose.model('rua', ruaSchema)