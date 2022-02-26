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
    case 'CREATE_NEW':
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

const createNew = (content) => ({
  type: 'CREATE_NEW',
  data: asObject(content),
})

const addNew = (anecdote) => ({
  type: 'CREATE_NEW',
  data: anecdote
})

const setAnecdotes = (anecdotes) => ({
  type: 'SET',
  data: anecdotes,
})

export default reducer
export {
  vote,
  createNew,
  addNew,
  setAnecdotes,
}