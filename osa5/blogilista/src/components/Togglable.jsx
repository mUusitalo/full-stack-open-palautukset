import { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  useImperativeHandle(ref, () => ({ toggleVisibility }));

  return (
    visible
      ? (
        <div>
          {children}
          <button type="button" onClick={toggleVisibility}>close</button>
        </div>
      )
      : <button type="button" onClick={toggleVisibility}>{buttonLabel}</button>
  );
});

Togglable.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
