import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({blog, handleLike, handleDelete, username}) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? "hide details" : "show details"}</button>
      {visible &&
        <div className='blog-details'>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {username === blog.user.username && 
            <button onClick={() => window.confirm(`Delete blog ${blog.title} by ${blog.author}?`) && handleDelete(blog)}>
              delete
            </button>
          }
        </div>
      }
    </div>
  )  
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}
export default Blog