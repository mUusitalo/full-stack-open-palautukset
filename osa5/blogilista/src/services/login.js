import axios from 'axios'
const baseUrl = '/api/login'

async function login(username, password) {
    return (await axios.post(baseUrl, {username, password})).data
}  

export default {login}