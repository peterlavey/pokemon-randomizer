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

    test('triggers onDismiss when clicked', () => {
        const onDismissMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        fireEvent.click(revealDiv);
        expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    test('triggers fallback setPokemon(undefined) when onDismiss is not provided', () => {
        const setPokemonMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} setPokemon={setPokemonMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        fireEvent.click(revealDiv);
        expect(setPokemonMock).toHaveBeenCalledWith(undefined);
    });

    test('handles keydown Enter and Space to dismiss', () => {
        const onDismissMock = jest.fn();
        const { container } = render(
            <Reveal pokemon={mockPokemon} onDismiss={onDismissMock} />
        );

        const revealDiv = container.querySelector('.reveal');
        fireEvent.keyDown(revealDiv, { key: 'Enter' });
        expect(onDismissMock).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(revealDiv, { key: ' ' });
        expect(onDismissMock).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(revealDiv, { key: 'Escape' });
        expect(onDismissMock).toHaveBeenCalledTimes(2);
    });
});
