var mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    post_type: String,
    post: String,
    responding_to: Number,
    user: String,
    comment: String,
    timestamp: Date
})

module.exports = mongoose.model('comentario', comentarioSchema)