/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SampleComponent from './sample-component';

describe('SampleComponent', () => {
  test('should start count 0', () => {
    const { container, getByText } = render(<SampleComponent text="Foo" />);
    const countButton = getByText('Count: 0');
    expect(container.querySelectorAll('li')).toHaveLength(0);
    fireEvent.click(countButton);
    fireEvent.click(countButton);
    expect(countButton).toHaveTextContent('Count: 2');
    expect(container.querySelectorAll('li')).toHaveLength(2);
    container.querySelectorAll('li').forEach((node) => {
      expect(node).toHaveTextContent('Foo');
    });
  });
});
