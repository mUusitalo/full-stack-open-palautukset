import { configureStore } from "@reduxjs/toolkit"
import anecdotes from './reducers/anecdoteReducer'
import notification from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    anecdotes,
    notification,
  }
})

export default store
