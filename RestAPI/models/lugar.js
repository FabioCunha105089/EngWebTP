var mongoose = require('mongoose')

var lugarSchema = new mongoose.Schema({
    _id: String,
    nome: String,
    rua: String
})

module.exports = mongoose.model('lugar', lugarSchema, 'lugar')