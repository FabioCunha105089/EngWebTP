const mongoose = require('mongoose')
var Rua = require('../models/rua')

module.exports.list = () => {
    return Rua
    .find()
    .sort({nome : 1}).
    exec()
}

module.exports.findById = id => {
    return Rua
    .findOne({_id : id})
    .exec()
}

module.exports.findByName = name => {
    return Rua
    .findOne({nome : nome})
    .exec()
}

module.exports.insert = async rua => {
    if (!(await Rua.findOne({_id : rua._id}).exec())) {
        var newRua = Rua(rua)
        return newRua.save()
    }
}

module.exports.delete = _id => {
    return Rua
    .findOneAndDelete({_id : _id})
    .exec()
}

module.exports.update = (_id, rua) => {
    return Rua
    .findOneAndUpdate({_id : _id}, rua, {new : true})
    .exec()
}