import { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({
  blog, handleLike, handleDelete, username,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="blog">
      {blog.title}
      {' '}
      {blog.author}
      <button className="show-details-button" type="button" onClick={() => setVisible(!visible)}>{visible ? 'hide details' : 'show details'}</button>
      {visible
        && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            likes
            {' '}
            {blog.likes}
            <button type="button" onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {username === blog.user.username
            && (
            <button type="button" onClick={() => window.confirm(`Delete blog ${blog.title} by ${blog.author || 'unnamed author'}?`) && handleDelete(blog)}>
              delete
            </button>
            )}
        </div>
        )}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    user: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};
export default Blog;
