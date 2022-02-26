import { useSelector, useDispatch } from "react-redux"
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  return [...anecdotes]
    .sort((a, b) => b.votes - a.votes)
    .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    .map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => {
            dispatch(vote(anecdote))
            dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
          }}>
            vote
          </button>
        </div>
      </div>
    )
}

export default AnecdoteList