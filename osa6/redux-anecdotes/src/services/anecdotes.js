import axios from 'axios'

const BASE_URL = 'http://localhost:3001/anecdotes'

const getAll = async () => (await axios.get(BASE_URL)).data

const createNew = async (content) => {
  const response = await axios.post(BASE_URL, {content, votes: 0})
  return response.data
}

export default { getAll, createNew }