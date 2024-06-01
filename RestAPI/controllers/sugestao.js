var Sugestao = require('../models/sugestao')

module.exports.list = () => {
    return Sugestao
        .find()
        .exec()
}

module.exports.addSugestao = (ruaId, nome, sugestao) => {
    return Sugestao.findOneAndUpdate(
        { rua: ruaId },
        { 
            $setOnInsert: { rua: ruaId, nome: nome },
            $push: { sugestoes: sugestao } 
        },
        { new: true, upsert: true, useFindAndModify: false }
    ).exec();
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
 