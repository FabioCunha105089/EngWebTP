var mongoose = require('mongoose')

var entidadeSchema = new mongoose.Schema({
    _id: Number,
    nome: String,
    numero: String,
    quantidade: String
})

module.exports = mongoose.model('entidade', entidadeSchema)