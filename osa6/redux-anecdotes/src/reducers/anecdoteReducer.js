import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch(action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToModify = state.find(anecdote => anecdote.id === id)
      const modified = {...anecdoteToModify, votes: anecdoteToModify.votes + 1}
      return state.map(anecdote => anecdote.id === id ? modified : anecdote)
    case 'APPEND':
      return state.concat(action.data)
    case 'SET':
      return action.data
    default:
      return state
  }
}

const vote = (id) => ({
  type: 'VOTE',
  data: {
    id,
  }
})

const append = (anecdote) => ({
  type: 'APPEND',
  data: anecdote,
})

const createNewAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(append(newAnecdote))
  }
}

const setAnecdotes = (anecdotes) => ({
  type: 'SET',
  data: anecdotes,
})

const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default reducer
export {
  vote,
  createNewAnecdote,
  append,
  setAnecdotes,
  initializeAnecdotes
}