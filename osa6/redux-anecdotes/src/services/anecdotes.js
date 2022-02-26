import axios from 'axios'

const BASE_URL = 'http://localhost:3001/anecdotes'

const getAll = async () => (await axios.get(BASE_URL)).data

const createNew = async (content) => {
  const response = await axios.post(BASE_URL, {content, votes: 0})
  return response.data
}

const vote = async anecdote => {
  const response = await axios.put(
    `${BASE_URL}/${anecdote.id}`,
    {...anecdote, votes: anecdote.votes + 1}
  )
  return response.data
}

export default { getAll, createNew, vote }