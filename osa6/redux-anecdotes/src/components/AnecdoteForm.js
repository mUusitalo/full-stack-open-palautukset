import { useDispatch } from "react-redux"
import { createNew } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const onSubmit = event => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createNew(anecdote))
    showNotification(`Created '${anecdote}'`)
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