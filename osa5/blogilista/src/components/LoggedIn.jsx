import {useEffect, useState, useRef} from 'react'

import Blog from './Blog'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const LoggedIn = ({name, handleLogout, handleError, handleSuccess}) => {
    const [blogs, setBlogs] = useState([])
    const formRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
          sortAndSetBlogs(blogs)
        )  
    }, [])

    const sortAndSetBlogs = newBlogs => {
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
    }

    const handleCreateBlog = blog => {
        sortAndSetBlogs([...blogs, blog])
        formRef.current.toggleVisibility()
        handleSuccess(`Created blog ${blog.title} by ${blog.author || "unnamed author"}`)
    }

    const handleLike = async blog => {
      try {
        const newBlog = await blogService.like(blog)
        sortAndSetBlogs(blogs.map(blog => 
          blog.id === newBlog.id
            ? {...newBlog, user:blog.user}
            : blog
        ))
      } catch (e) {
        handleError(e.response.data.error)
      }
    }
    
    return (
        <>
            <h2>blogs</h2>
            <p>
              logged in as {name}
              <button onClick={handleLogout}>log out</button>
            </p>
            <Togglable buttonLabel="create new blog" ref={formRef}>
              <BlogForm {...{handleCreateBlog}}/>
            </Togglable>
            {blogs.map(blog =>
              <Blog {...{
                key: blog.id,
                blog,
                handleError,
                handleLike
              }}/>
            )}
        </>
    )
}

export default LoggedIn