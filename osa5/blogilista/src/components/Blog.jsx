import { useState } from 'react'

const Blog = ({blog}) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? "hide details" : "show details"}</button>
      {visible &&
        <div className='blog-details'>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button>like</button></p>
          <p>{blog.user.name}</p>
        </div>
      }
      
    </div>
  )  
}

export default Blog