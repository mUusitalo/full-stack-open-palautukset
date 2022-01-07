
const FormField = ({name, value, onChange, hidden}) => (
    <div>
        <label>{name}</label>
        <input
            type={hidden?.toLowerCase() === "true" ? "password" : "text"}
            value={value}
            name={name}
            onChange={({target}) => onChange(target.value)}
        />
    </div>
)

export default FormField