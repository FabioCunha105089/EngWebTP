const mongoose = require('mongoose')
var Rua = require('../models/rua')

module.exports.list = () => {
    return Rua
    .find()
    .sort({nome : 1}).
    exec()
}

module.exports.findByNumero = numero => {
    return Rua
    .findOne({numero : numero})
    .exec()
}

module.exports.findByName = name => {
    return Rua
    .findOne({nome : nome})
    .exec()
}

module.exports.insert = async rua => {
    if (!(await Rua.findOne({numer : rua.numero}).exec())) {
        var newRua = Rua(rua)
        return newRua.save()
    }
}

module.exports.delete = numero => {
    return Rua
    .findOneAndDelete({numero : numero})
    .exec()
}

module.exports.update = (numero, rua) => {
    return Rua
    .findOneAndUpdate({numero : numero}, rua, {new : true})
    .exec()
}