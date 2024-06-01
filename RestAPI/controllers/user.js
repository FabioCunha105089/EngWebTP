var User = require('../models/user')

// Devolve a lista de Users
module.exports.list = () => {
    return User
        .find()
        .sort({ name : 1 })
        .exec()
}

module.exports.getUser = id => {
    return User
        .findOne({ _id : id })
        .exec()
}

module.exports.addUser = u => {
    return User
        .create(u)
        .exec()
}

module.exports.updateUser = (id, info) => {
    return User
        .updateOne({ _id : id }, info)
        .exec()
}

module.exports.updateUserLevel = (id, level) => {
    return User
        .updateOne({ _id : id }, { level : level })
        .exec()
}

module.exports.updateUserSuggestions = id => {
    return User
        .findByIdAndUpdate(
            id,
            { $inc: {sugestoesAceites: 1 } },
            { new: true, useFindAndModify: false }
        ).exec()
}

module.exports.updateUserPassword = (id, pwd) => {
    return User
        .updateOne({ _id : id }, pwd)
        .exec()
}

module.exports.deleteUser = id => {
    return User
        .findByIdAndDelete(id)
        .exec()
}
 