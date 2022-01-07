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

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedInUser)
    setUser(user)
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login(username, password)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      console.error(e)
      alert(e.response.data.error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  return (
    user 
    ?
      <>
        <h2>blogs</h2>
        <p>
          logged in as {user.name}
          <button onClick={handleLogout}>log out</button>
        </p>
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