import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import Blog from './Blog';

describe('<Blog/>', () => {
  let blog;
  let component;
  let handleLike;
  let handleDelete;
  beforeEach(() => {
    blog = {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 0,
      user: {
        name: 'name',
        username: 'username',
      },
    };

    handleLike = jest.fn();
    handleDelete = jest.fn();

    component = render(
      <Blog
        {...{
          blog,
          username: 'username',
          handleLike,
          handleDelete,
        }}
      />
    );
  });

  describe('When show details has not been clicked', () => {
    test('renders title and author', () => {
      expect(component.container).toHaveTextContent('title');
      expect(component.container).toHaveTextContent('author');
    });

    test('doesnt render url or likes', () => {
      expect(component.container).not.toHaveTextContent('url');
      expect(component.container).not.toHaveTextContent('0');
    });
  });

  describe('When show details has been clicked', () => {
    test('should render title, author, url and likes', () => {
      const button = component.getByText('show details');
      fireEvent.click(button);

      expect(component.container).toHaveTextContent('title');
      expect(component.container).toHaveTextContent('author');
      expect(component.container).toHaveTextContent('url');
      expect(component.container).toHaveTextContent('0');
    });
  });

  describe('Like button calls handleLike as many times as it is pressed', () => {
    test('should call handleLike twice', () => {
      const showDetails = component.getByText('show details');
      fireEvent.click(showDetails);

      const like = component.getByText('like');
      for (let i = 0; i < 2; i++) {
        fireEvent.click(like);
      }

      expect(handleLike.mock.calls).toHaveLength(2);
    });
  });
});
