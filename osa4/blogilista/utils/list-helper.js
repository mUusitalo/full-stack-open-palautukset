function dummy(blogs) {
    return 1
}

function totalLikes(blogs) {
    return blogs.length
        ? blogs.reduce((sum, current) => sum + current.likes, 0)
        : 0
}

function favoriteBlog(blogs) {
    if (blogs.length === 0) {return}

    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const { title, author, likes, } = blogs.find(blog => blog.likes === maxLikes)
    return { title, author, likes, }
}

function mostLikes(blogs) {
    if (blogs.length === 0) {return}

    const authors = {}
    
    for (const blog of blogs) {
        authors[blog.author] ??= 0
        authors[blog.author] += blog.likes
    }

    const [author, likes] = Object
        .entries(authors)
        .reduce((best, next) => best[1] >= next[1] ? best : next)

    return { author, likes }
}

function mostBlogs(blogs) {
    if (blogs.length === 0) {return}

    const authors = {}
    
    for (const blog of blogs) {
        authors[blog.author] ??= 0
        authors[blog.author]++
    }

    const [author, numberOfBlogs] = Object
        .entries(authors)
        .reduce((best, next) => best[1] >= next[1] ? best : next)

    return { author, blogs: numberOfBlogs }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}