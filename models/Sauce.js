const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
    userId : { type: String, require: true},
    name : { type: String, require: true },
    manufacturer : { type: String, require: true },
    description : { type: String, require: true },
    mainPepper : { type: String, require: true },
    imageUrl : { type: String, require: true },
    heat : { type: Number, require: true },
    likes : { type: Number },
    dislikes : { type: Number},
    usersLiked : { type: Array},
    usersDisliked : { type: Array}


})

module.exports = mongoose.model('Sauce', sauceSchema)
