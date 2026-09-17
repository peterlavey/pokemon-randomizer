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

test('renders presentation directly when url has presentation query parameter', () => {
  const originalLocation = window.location;
  delete window.location;
  window.location = new URL('http://localhost:3000/?presentation=true');

  const { container } = render(<App />);
  expect(container.querySelector('.presentation')).toBeInTheDocument();
  expect(container.querySelectorAll('.pokemon-wrapper').length).toBe(6);

  window.location = originalLocation;
});
