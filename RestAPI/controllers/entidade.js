const mongoose = require('mongoose')
var Entidade = require('../models/entidade')

module.exports.list = () => {
    return Entidade
    .find()
    .sort({nome : 1})
    .exec()
}

module.exports.findById = id => {
    return Entidade
    .findOne({_id : id})
    .exec()
}

module.exports.findByNome = nome => {
    return Entidade
    .find({nome : nome})
    .exec()
}

module.exports.insert = async entidade => {
    if (!(await Entidade.findOne({_id : entidade._id}).exec())) {
        var newEntidade = Entidade(entidade)
        return newEntidade.save()
    }
}

module.exports.delete = id => {
    return Entidade
    .findOneAndDelete({_id : id})
    .exec()
}

module.exports.update = (id, entidade) => {
    return Entidade
    .findOneAndUpdate({_id : id}, entidade, {new : true})
    .exec()
}