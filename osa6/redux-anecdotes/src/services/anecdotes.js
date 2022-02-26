import axios from 'axios'

const BASE_URL = 'http://localhost:3001/anecdotes'

const getAll = async () => (await axios.get(BASE_URL)).data

export default { getAll }