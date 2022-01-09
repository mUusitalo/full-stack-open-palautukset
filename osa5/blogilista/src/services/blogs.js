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

async function like(blog) {
  const modifiedBlog = {...blog, user: blog.user.id, likes: blog.likes + 1}
  const response = await axios.put(`${baseUrl}/${blog.id}`, modifiedBlog)
  return response.data
}

async function deleteBlog(id) {
  const config = {headers: {Authorization: authorizationHeader}}
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

export default { getAll, create, like, deleteBlog, setToken }