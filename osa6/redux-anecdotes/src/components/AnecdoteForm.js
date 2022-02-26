import { connect } from "react-redux"

import { createNewAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = ({ createNewAnecdote, setNotification }) => {
  const onSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    createNewAnecdote(content)
    setNotification(`Created '${content}'`, 5)
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

export default connect(
  null,
  {
    createNewAnecdote,
    setNotification,
  }
)(AnecdoteForm)