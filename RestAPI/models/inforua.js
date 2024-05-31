var mongoose = require('mongoose')

const figuraSchema = new mongoose.Schema({
    foto_id: String,
    path: String,
    legenda: String
}, {_id: false})

const casaSchema = new mongoose.Schema({
    numero: String,
    enfiteuta: String,
    desc: [String],
    foro: String
}, {_id: false})

const comentarioSchema = new mongoose.Schema({
    user: String,
    comment: String,
    timestamp: String
})

var infoRuaSchema = new mongoose.Schema({
    _id: Number,
    nome: String,
    desc: [String],
    figuras: [figuraSchema],
    casas: [casaSchema],
    comentarios: [comentarioSchema]
})

module.exports = mongoose.model('inforua', infoRuaSchema)