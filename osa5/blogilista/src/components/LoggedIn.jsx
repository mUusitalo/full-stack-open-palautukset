import {useEffect, useState, useRef} from 'react'

import Blog from './Blog'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import Togglable from './Togglable'

const LoggedIn = ({user, handleLogout, handleError, handleSuccess}) => {
    const [blogs, setBlogs] = useState([])
    const formRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
          setBlogs(blogs)
        )  
    }, [])

    const handleCreateBlog = blog => {
        setBlogs([...blogs, {...blog, user}])
        formRef.current.toggleVisibility()
        handleSuccess(`Created blog ${blog.title} by ${blog.author || "unnamed author"}`)
    }

    const handleLike = async blog => {
      try {
        const newBlog = await blogService.like(blog)
        setBlogs(blogs.map(blog => 
          blog.id === newBlog.id
            ? {...newBlog, user:blog.user}
            : blog
        ))
      } catch (e) {
        handleError(e.response.data.error)
      }
    }

    const handleDelete = async blog => {
      try {
        await blogService.deleteBlog(blog.id)
        handleSuccess(`Deleted blog ${blog.title}`)
        setBlogs([...blogs].filter(b => b.id !== blog.id))
      } catch (e) {
        handleError(e.response.data.error)
      }
    }
    
    return (
        <>
            <h2>blogs</h2>
            <p>
              logged in as {user.name}
              <button onClick={handleLogout}>log out</button>
            </p>
            <Togglable buttonLabel="create new blog" ref={formRef}>
              <BlogForm {...{handleCreateBlog}}/>
            </Togglable>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog =>
              <Blog {...{
                key: blog.id,
                username: user.username,
                blog,
                handleLike,
                handleDelete,
              }}/>
            )}
        </>
    )
}

export default LoggedIn