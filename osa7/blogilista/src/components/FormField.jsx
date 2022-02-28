import PropTypes from 'prop-types';

function FormField({ name, value, onChange, hidden }) {
  return (
    <div>
      <label htmlFor={name}>
        {name}
        <input
          id={name}
          type={hidden?.toLowerCase() === 'true' ? 'password' : 'text'}
          value={value}
          name={name}
          onChange={({ target }) => onChange(target.value)}
        />
      </label>
    </div>
  );
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hidden: PropTypes.string,
};

FormField.defaultProps = {
  hidden: undefined,
};

export default FormField;
