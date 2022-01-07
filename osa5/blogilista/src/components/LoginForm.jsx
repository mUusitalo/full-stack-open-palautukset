import {useState} from 'react'

import FormField from './FormField'
import loginService from '../services/login'

const LoginForm = ({handleLogin, handleError}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await loginService.login(username, password)
            setUsername('')
            setPassword('')
            handleLogin(response)
        } catch (e) {
            handleError(e.response.data.error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <FormField name="username" value={username} onChange={setUsername}/>
                <FormField name="password" value={password} onChange={setPassword} hidden="true"/>
            </div>
            <button type="submit">login</button>
        </form>
    )
}

export default LoginForm