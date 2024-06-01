var Sugestao = require('../models/sugestao')

module.exports.list = () => {
    return Sugestao
        .find()
        .exec()
}

module.exports.getSugestao = (ruaId, sugestaoId) => {
    return Sugestao
        .findOne({ "rua": ruaId, "sugestoes._id": sugestaoId }, { "sugestoes.$": 1 })
        .exec();
}

module.exports.addSugestao = (ruaId, sugestao) => {
    return Sugestao
        .findOneAndUpdate(
            { rua: ruaId },
            { $push: { sugestoes: sugestao } },
            { new: true, useFindAndModify: false }
        )
        .exec();
}

module.exports.deleteSugestao = (ruaId, sugestaoId) => {
    return Sugestao
        .findOneAndUpdate(
            { rua: ruaId },
            { $pull: { sugestoes: { _id: sugestaoId } } },
            { new: true, useFindAndModify: false }
        )
        .exec();
}
 