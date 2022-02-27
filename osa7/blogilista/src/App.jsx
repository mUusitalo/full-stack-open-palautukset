import React, { useState, useEffect } from 'react';

import blogService from './services/blogs';
import LoggedIn from './components/LoggedIn';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';

function App() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({});
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    const user = JSON.parse(loggedInUser);
    setUser(user);
    blogService.setToken(user?.token ?? null);
  }, []);

  const showNotification = (message, success = true) => {
    if (notificationId) { clearTimeout(notificationId); } // cancel old timeout

    setNotification({ message, success });
    const id = setTimeout(() => setNotification({}), 5000);
    setNotificationId(id);
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
      <Notification message={notification?.message} success={notification?.success} />
      {
        user
          ? (
            <LoggedIn {...{
              user,
              handleLogout,
              handleError,
              handleSuccess: (message) => showNotification(message),
            }}
            />
          )
          : (
            <>
              <h2>login</h2>
              <LoginForm
                {...{ handleLogin, handleError }}
              />
            </>
          )
}
    </>
  );
}

export default App;
