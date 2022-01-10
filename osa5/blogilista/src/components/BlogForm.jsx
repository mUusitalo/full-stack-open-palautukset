import { useState } from 'react';
import PropTypes from 'prop-types';

import FormField from './FormField';

function BlogForm({ handleSubmit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmitAndReset = (event) => {
    event.preventDefault();
    handleSubmit({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmitAndReset}>
        <div>
          <FormField id="title" name="title" value={title} onChange={setTitle} />
          <FormField id="author" name="author" value={author} onChange={setAuthor} />
          <FormField id="url" name="url" value={url} onChange={setUrl} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default BlogForm;
