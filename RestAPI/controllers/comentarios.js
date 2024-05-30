const mongoose = require('mongoose')
var Comentario = require('../models/comentario')

module.exports.list = () => {
    return Comentario
    .find()
    .exec()
}

module.exports.findByPost = (tipo, id) => {
    return Comentario
    .find({post_type : tipo, post : id})
    .exec()
}

module.exports.findReplies = id => {
    return Comentario
    .find({responding_to : id})
    .exec()
}

module.exports.insert = async comentario => {
    return Comentario(comentario).save()
}

module.exports.delete = id => {
    return Comentario
    .findOneAndDelete({_id : id})
    .exec()
}

module.exports.update = (id, comentario) => {
    return Comentario
    .findOneAndUpdate({_id : id}, comentario, {new : true})
    .exec()
}