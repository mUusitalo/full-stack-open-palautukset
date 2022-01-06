const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true},
    likes: {type: Number, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    author: String,
})

blogSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        ret.user = ret.user instanceof mongoose.Types.ObjectId ? ret.user.toString() : ret.user
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
