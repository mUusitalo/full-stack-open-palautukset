import axios from 'axios'
const baseUrl = '/api/blogs'

let authorizationHeader = null

function setToken(newToken) {
  authorizationHeader = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

async function create({title, author, url}) {
  const config = {headers: {Authorization: authorizationHeader}}
  const response = await axios.post(baseUrl, {title, author, url}, config)
  return response.data
}

export default { getAll, create, setToken }