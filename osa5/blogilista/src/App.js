import React, { useState, useEffect } from 'react'

import blogService from './services/blogs'
import LoggedIn from './components/LoggedIn'
import LoginForm from './components/LoginForm'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedInUser)
    setUser(user)
    blogService.setToken(user?.token ?? null)
  }, [])

  const handleLogin = (user) => {
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
  }

  const handleLoginError = (e) => {
      console.error(e)
      alert(e.response.data.error)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    setUser(null)
  }

  return (
    user 
    ?
      <LoggedIn {...{name: user.name, handleLogout}}/>
    :
      <>
        <h2>log in</h2>
        <LoginForm
          {...{handleLogin, handleError: handleLoginError}}
        />
      </>
  )
}

export default App