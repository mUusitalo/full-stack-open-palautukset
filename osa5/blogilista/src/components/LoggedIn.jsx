import {useEffect, useState} from 'react'

import Blog from './Blog'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'

const LoggedIn = ({name, handleLogout, handleCreateBlogError}) => {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )  
      }, [])

    const handleCreateBlog = (blog) => {
        setBlogs([...blogs, blog])
    }

    return (
        <>
            <h2>blogs</h2>
            <p>
              logged in as {name}
              <button onClick={handleLogout}>log out</button>
            </p>
            <BlogForm {...{handleCreateBlog, handleError: handleCreateBlogError}}/>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </>
    )
}

export default LoggedIn