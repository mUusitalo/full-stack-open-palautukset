const LoginForm = ({password, username, handleLogin}) => {
    return (
        <form onSubmit={handleLogin}>
            <div>
                <Field name="username" value={username.value} onChange={username.onChange}/>
                <Field name="password" value={password.value} onChange={password.onChange} hidden="true"/>
            </div>
            <button type="submit">login</button>
        </form>
    )
}

const Field = ({name, value, onChange, hidden}) => (
    <div>
        {name}
        <input
            type={hidden?.toLowerCase() === "true" ? "password" : "text"}
            value={value}
            name={name}
            onChange={({target}) => onChange(target.value)}
        />
    </div>
)

export default LoginForm