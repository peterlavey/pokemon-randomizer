import React from 'react';
import { render, screen } from '@testing-library/react';
import Mobile from './mobile';

jest.mock('./stats/stats', () => ({ stats }) => (
    <div data-testid="mock-stats">Stats rendered</div>
));

describe('Mobile Component Unit Tests', () => {
    const mockPokemon = {
        id: 25,
        name: { english: 'Pikachu' },
        species: 'Mouse Pokémon',
        description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
        height: 0.4,
        weight: 6.0,
        type: ['Electric'],
        image: { hires: 'pikachu_hires.png' },
        cry: 'pikachu_cry.mp3',
        base: { hp: 35, attack: 55, defense: 40, speed: 90, spDefense: 50, spAttack: 50 },
    };

    test('renders pokemon information, image, types, stats, and audio cry', () => {
        const { container } = render(<Mobile {...mockPokemon} />);

        // Primary type container class
        expect(container.querySelector('.container.electric')).toBeInTheDocument();

        // Reveal image
        const img = screen.getByAltText('Pikachu');
        expect(img).toHaveAttribute('src', 'pikachu_hires.png');

        // Heading
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('#25-Pikachu');

        // Species and description
        expect(screen.getByText('Mouse Pokémon')).toBeInTheDocument();
        expect(screen.getByText(/When several of these Pokémon gather/)).toBeInTheDocument();

        // Height & Weight
        expect(screen.getByText(/0.4m/)).toBeInTheDocument();
        expect(screen.getByText(/6kg/)).toBeInTheDocument();

        // Type badge
        expect(screen.getByText('Electric')).toBeInTheDocument();

        // Stats
        expect(screen.getByTestId('mock-stats')).toBeInTheDocument();

        // Cry audio
        const audio = container.querySelector('audio');
        expect(audio).toHaveAttribute('src', 'pikachu_cry.mp3');

        // Type particles canvas
        expect(screen.getByTestId('type-particles')).toBeInTheDocument();
    });

    test('handles missing optional properties gracefully', () => {
        const minimalPokemon = {
            id: 1,
            name: {},
            type: [],
        };
        const { container } = render(<Mobile {...minimalPokemon} />);

        expect(container.querySelector('.container.normal')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('#1-');
        expect(container.querySelector('audio')).toBeNull();
        expect(screen.queryByTestId('mock-stats')).toBeNull();
    });
});
