import { useDispatch } from "react-redux"

import anecdoteService from '../services/anecdotes'
import { createNewAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const onSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createNewAnecdote(content))
    showNotification(`Created '${content}'`)
  }

  const showNotification = message => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div><input name="anecdote"/></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm