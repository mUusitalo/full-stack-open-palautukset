import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm/>', () => {
  test('should call handleCreate with correct arguments when submit is clicked', () => {
    const input = {
      title: 'title',
      author: 'author',
      url: 'url',
    };

    const handleSubmit = jest.fn();
    const component = render(<BlogForm {...{ handleSubmit }} />);

    Object.entries(input).forEach(([k, v]) => {
      const inputField = component.container.querySelector(`#${k}`);
      fireEvent.change(inputField, { target: { value: v } });
    });

    const button = component.container.querySelector('button[type="submit"]');
    fireEvent.click(button);

    expect(handleSubmit.mock.calls[0][0]).toStrictEqual(input);
  });
});
