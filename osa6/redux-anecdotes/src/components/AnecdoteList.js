import { useSelector, useDispatch } from "react-redux"
import { vote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

  const showNotification = message => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(clearNotification()), 5000)
  }

  return anecdotes
    .sort((a, b) => b.votes - a.votes)
    .map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => {
            dispatch(vote(anecdote.id))
            showNotification(`You voted '${anecdote.content}'`)
          }}>
            vote
          </button>
        </div>
      </div>
    )
}

export default AnecdoteList