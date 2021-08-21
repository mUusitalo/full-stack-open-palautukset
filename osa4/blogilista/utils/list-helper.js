const blog = require("../models/blog")
const { mapReduce, getMaxListeners } = require("../models/blog")

function dummy(blogs) {
    return 1
}

function totalLikes(blogs) {
    return blogs.length
        ? blogs.reduce((sum, current) => sum + current.likes, 0)
        : 0
}

function favoriteBlog(blogs) {
    if (blogs.length === 0) return undefined

    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const { title, author, likes, } = blogs.find(blog => blog.likes === maxLikes)
    return { title, author, likes, }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}