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
          setBlogs( blogs )
        )  
      }, [])

    const handleCreateBlog = (blog) => {
        setBlogs([...blogs, blog])
        formRef.current.toggleVisibility()
        handleSuccess(`Created blog ${blog.title} by ${blog.author || "unnamed author"}`)
    }

    return (
        <>
            <h2>blogs</h2>
            <p>
              logged in as {name}
              <button onClick={handleLogout}>log out</button>
            </p>
            <Togglable buttonLabel="create new blog" ref={formRef}>
              <BlogForm {...{handleCreateBlog, handleError}}/>
            </Togglable>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </>
    )
}

export default LoggedIn