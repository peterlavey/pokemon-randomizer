import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from './startScreen';

describe('StartScreen Component', () => {
    test('renders title, badge, and press start button', () => {
        render(<StartScreen onStart={jest.fn()} />);

        expect(screen.getByText('NINTENDO 64')).toBeInTheDocument();
        expect(screen.getByText('POKÉMON')).toBeInTheDocument();
        expect(screen.getByText('STADIUM')).toBeInTheDocument();
        expect(screen.getByText('TEAM RANDOMIZER')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /press start/i })).toBeInTheDocument();
    });

    test('calls onStart when PRESS START button is clicked', () => {
        const handleStart = jest.fn();
        render(<StartScreen onStart={handleStart} />);

        const button = screen.getByRole('button', { name: /press start/i });
        fireEvent.click(button);

        expect(handleStart).toHaveBeenCalledTimes(1);
    });

    test('calls onStart when container is clicked', () => {
        const handleStart = jest.fn();
        const { container } = render(<StartScreen onStart={handleStart} />);

        const screenContainer = container.querySelector('.startScreen');
        fireEvent.click(screenContainer);

        expect(handleStart).toHaveBeenCalledTimes(1);
    });

    test('calls onStart when Enter or Space key is pressed', () => {
        const handleStart = jest.fn();
        render(<StartScreen onStart={handleStart} />);

        fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
        expect(handleStart).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(window, { key: ' ', code: 'Space' });
        expect(handleStart).toHaveBeenCalledTimes(2);

        // Irrelevant key should not trigger onStart
        fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
        expect(handleStart).toHaveBeenCalledTimes(2);
    });

    test('cleans up keydown listener on unmount', () => {
        const handleStart = jest.fn();
        const { unmount } = render(<StartScreen onStart={handleStart} />);

        unmount();
        fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
        expect(handleStart).not.toHaveBeenCalled();
    });
});
