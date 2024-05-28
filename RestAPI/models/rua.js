var mongoose = require('mongoose')

const figuraSchema = new mongoose.Schema({
    foto_id: String,
    path: String,
    legenda: String
}, {_id: false})

const casaSchema = new mongoose.Schema({
    numero: String,
    efitetura: String,
    desc: [String],
    foro: String
}, {_id: false})

var ruaSchema = new mongoose.Schema({
    _id: String,
    numero: String,
    nome: String,
    desc: [String],
    figuras: [figuraSchema],
    casas: [casaSchema]
})

module.exports = mongoose.model('rua', ruaSchema, 'rua')