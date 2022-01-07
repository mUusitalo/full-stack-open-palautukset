import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const responseData = (await loginService.login(username, password)).data
      setUser(responseData)
      setUsername('')
      setPassword('')
    } catch (e) {
      console.error(e)
      alert(e.response.data.error)
    }
  }

  return (
    user 
    ?
      <>
        <h2>blogs</h2>
        <p>Logged in as {user.name}</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    :
      <>
        <h2>log in</h2>
        <LoginForm
          {...{
            username: {value: username, onChange: setUsername},
            password: {value: password, onChange: setPassword},
            handleLogin
          }}
        />
      </>
  )
}

export default App