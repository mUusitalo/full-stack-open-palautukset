const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [3, "Username must be at least 3 characters long"]
    },
    passwordHash: {type: String, required: true},
    name: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

userSchema.plugin(uniqueValidator, {message: 'Username {VALUE} has already been taken'})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        ret.blogs = ret?.blogs?.map(blog => blog instanceof mongoose.Types.ObjectId ? blog.toString() : blog)
        delete ret.passwordHash
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('User', userSchema)
