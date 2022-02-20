import { configureStore } from "@reduxjs/toolkit"
import anecdotes from './reducers/anecdoteReducer'
import notification from './reducers/notificationReducer'
import filter from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    anecdotes,
    notification,
    filter,
  }
})

export default store
