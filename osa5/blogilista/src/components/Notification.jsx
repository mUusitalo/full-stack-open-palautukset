import PropTypes from 'prop-types';

function Notification({ message, success = true }) {
  if (!message) return null;

  const style = {
    fontSize: 30,
    color: success ? 'green' : 'red',
    backgroundColor: 'snow',
    border: 5,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
  };

  return <div className="notification" style={style}>{message}</div>;
}

Notification.propTypes = {
  message: PropTypes.string,
  success: PropTypes.bool,
};

Notification.defaultProps = {
  message: undefined,
  success: false,
};

export default Notification;
