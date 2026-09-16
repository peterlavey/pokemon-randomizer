import { render } from '@testing-library/react';
import App from './App';

test('renders team container and initial pokeball selection', () => {
  const { container } = render(<App />);
  const choosePokeballsElement = container.querySelector('.choosePokeballs');
  expect(choosePokeballsElement).toBeInTheDocument();
});
