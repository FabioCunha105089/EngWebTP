const mongoose = require('mongoose')
var infoRua = require('../models/inforua')

module.exports.list = () => {
    return infoRua
    .find()
    .sort({ _id : 1 })
    .exec()
}

module.exports.findById = id => {
    return infoRua
    .findOne({_id : id})
    .exec()
}

module.exports.findByName = nome => {
    return infoRua
    .findOne({nome : nome})
    .exec()
}

module.exports.insert = info => {
    if (infoRua.find({_id : info._id}).exec().lentgth != 1) {
        var newInfoRua = new infoRua(info)
        return newInfoRua.save()
    }
}

module.exports.delete = id => {
    return infoRua
    .findByIdAndDelete(id)
    .exec()
}

module.exports.update = (id, infoRua) => {
    return infoRua
    .findOneAndUpdate({_id : id}, infoRua, {new : true})
    .exec()
}