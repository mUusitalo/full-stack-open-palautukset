import axios from 'axios'
const baseUrl = '/api/login'

async function login(username, password) {
    return axios.post(baseUrl, {username, password})
}  

export default {login}