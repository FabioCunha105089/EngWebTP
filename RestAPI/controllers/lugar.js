const mongoose = require('mongoose')
var Lugar = require('../models/lugar')

module.exports.list = () => {
    return Lugar
        .find()
        .sort({ nome: 1 })
        .exec()
}

module.exports.findById = id => {
    return Lugar
        .findOne({ _id: id })
        .exec()
}

module.exports.findByRua = numero => {
    return Lugar
        .find({ numero: numero })
        .exec()
}

module.exports.findByNome = nome => {
    return Lugar
        .findOne({ nome: nome })
        .exec()
}

module.exports.insert = async lugar => {
    if (!(await Lugar.findOne({ _id: lugar._id }).exec())) {
        var newLugar = Lugar(lugar)
        return newLugar.save()
    }
}

module.exports.delete = id => {
    return Lugar
        .findOneAndDelete({ _id: id })
        .exec()
}

module.exports.update = (id, lugar) => {
    return Lugar
        .findOneAndUpdate({ _id: id }, lugar, { new: true })
        .exec()
}