var Sugestao = require('../models/sugestao')

module.exports.list = () => {
    return Sugestao
        .find()
        .exec()
}

module.exports.sugestoesRua = id => {
    return Sugestao
        .findOne({ rua : id })
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

module.exports.deleteSugestao = async (ruaId, sugestaoId) => {
    const result = await Sugestao.findOneAndUpdate(
        { rua: ruaId },
        { $pull: { sugestoes: { _id: sugestaoId } } },
        { new: true, useFindAndModify: false }
    ).exec();

    if (result && result.sugestoes.length === 0) {
        await Sugestao.deleteOne({ rua: ruaId }).exec();
    }

    return result;
};
 