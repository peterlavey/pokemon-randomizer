import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders start screen and transitions to pokeball selection upon start', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.startScreen')).toBeInTheDocument();

  const startButton = screen.getByRole('button', { name: /press start/i });
  fireEvent.click(startButton);

  const choosePokeballsElement = container.querySelector('.choosePokeballs');
  expect(choosePokeballsElement).toBeInTheDocument();
});
