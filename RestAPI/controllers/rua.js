const mongoose = require('mongoose')
var Rua = require('../models/rua')

module.exports.list = () => {
    return Rua
    .find()
    .sort({ nome : 1 }).
    exec()
}

module.exports.findById = id => {
    return Rua
    .findOne({_id : id})
    .exec()
}

module.exports.findByName = nome => {
    return Rua
    .findOne({nome : nome})
    .exec()
}

module.exports.insert = rua => {
    if (Rua.find({_id : rua._id}).exec().lentgth != 1) {
        var newRua = new Rua(rua)
        return newRua.save()
    }
}

module.exports.delete = id => {
    return Rua
    .findByIdAndDelete(id)
    .exec()
}

module.exports.update = (_id, rua) => {
    return Rua
    .findOneAndUpdate({_id : _id}, rua, {new : true})
    .exec()
}