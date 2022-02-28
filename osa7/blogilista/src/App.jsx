import React, { useState, useEffect } from 'react';

import blogService from './services/blogs';
import LoggedIn from './components/LoggedIn';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import { setNotification } from './reducers/notification';
import { useDispatch } from 'react-redux';

function App() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    const user = JSON.parse(loggedInUser);
    setUser(user);
    blogService.setToken(user?.token ?? null);
  }, []);

  const showNotification = (message, success = true) => {
    dispatch(setNotification(message, success, 5));
  };

  const handleLogin = (user) => {
    window.localStorage.setItem('loggedInUser', JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
    showNotification(`Logged in as ${user.name}`);
  };

  const handleError = (message) => {
    console.error(message);
    showNotification(message, false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    blogService.setToken(null);
    setUser(null);
    showNotification('Succesfully logged out');
  };
  return (
    <>
      <Notification />
      {user ? (
        <LoggedIn
          {...{
            user,
            handleLogout,
            handleError,
            handleSuccess: (message) => showNotification(message),
          }}
        />
      ) : (
        <>
          <h2>login</h2>
          <LoginForm {...{ handleLogin, handleError }} />
        </>
      )}
    </>
  );
}

export default App;
