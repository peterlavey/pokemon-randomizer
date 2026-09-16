import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reveal, { TYPE } from './reveal';

jest.mock('./mobile/mobile', () => ({ name }) => (
    <div data-testid="mock-mobile">{name?.english}</div>
));

describe('Reveal Component Unit Tests', () => {
    const mockPokemon = {
        id: 1,
        name: { english: 'Bulbasaur' },
    };

    test('returns null when pokemon is null or undefined', () => {
        const { container } = render(<Reveal pokemon={null} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders Mobile component when pokemon is provided', () => {
        render(<Reveal pokemon={mockPokemon} />);
        expect(screen.getByTestId('mock-mobile')).toHaveTextContent('Bulbasaur');
    });

    test('fast-forwards animation on first click, and triggers onDismiss on second click', () => {
        const onDismissMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        expect(revealDiv).not.toHaveClass('revealed');

        // First click: fast-forward animations
        fireEvent.click(revealDiv);
        expect(revealDiv).toHaveClass('revealed');
        expect(onDismissMock).not.toHaveBeenCalled();

        // Second click: dismiss reveal
        fireEvent.click(revealDiv);
        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    test('fast-forwards animation on first click, and triggers fallback setPokemon(undefined) on second click', () => {
        const setPokemonMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} setPokemon={setPokemonMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        expect(revealDiv).not.toHaveClass('revealed');

        // First click: fast-forward
        fireEvent.click(revealDiv);
        expect(revealDiv).toHaveClass('revealed');
        expect(setPokemonMock).not.toHaveBeenCalled();

        // Second click: fallback dismissal
        fireEvent.click(revealDiv);
        expect(setPokemonMock).toHaveBeenCalledWith(undefined);
    });

    test('handles keydown Enter and Space to fast-forward then dismiss', () => {
        const onDismissMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');

        // Escape should not trigger fast-forward or dismissal
        fireEvent.keyDown(revealDiv, { key: 'Escape' });
        expect(revealDiv).not.toHaveClass('revealed');
        expect(onDismissMock).not.toHaveBeenCalled();

        // First Enter keydown: fast-forward
        fireEvent.keyDown(revealDiv, { key: 'Enter' });
        expect(revealDiv).toHaveClass('revealed');
        expect(onDismissMock).not.toHaveBeenCalled();

        // Second Enter keydown: dismiss
        fireEvent.keyDown(revealDiv, { key: 'Enter' });
        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    test('triggers onDismiss on first click if animation completed naturally', () => {
        const onDismissMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');

        // Simulate animationEnd event
        fireEvent.animationEnd(revealDiv, { animationName: 'revealImage' });
        expect(revealDiv).toHaveClass('revealed');

        // First click after animation completed immediately dismisses
        fireEvent.click(revealDiv);
        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    test('resets animation state when pokemon prop changes', () => {
        const onDismissMock = jest.fn();
        const { container, rerender } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        fireEvent.click(revealDiv);
        expect(revealDiv).toHaveClass('revealed');

        // Rerender with a different pokemon
        const nextPokemon = { id: 2, name: { english: 'Ivysaur' } };
        rerender(<Reveal pokemon={nextPokemon} onDismiss={onDismissMock} />);

        expect(revealDiv).not.toHaveClass('revealed');

        // First click on new pokemon fast-forwards
        fireEvent.click(revealDiv);
        expect(revealDiv).toHaveClass('revealed');
        expect(onDismissMock).not.toHaveBeenCalled();
    });
});
