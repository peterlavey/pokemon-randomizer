import React from 'react';
import { render, screen } from '@testing-library/react';
import Pokeballs from './pokeballs';
import { POKEBALL } from '../../../constants/gameConstants';

jest.mock('./pokeball/pokeball', () => {
    const { POKEBALL } = jest.requireActual('../../../constants/gameConstants');
    return {
        __esModule: true,
        POKEBALL,
        default: ({ type, pokemonImg, isRevealed, isCurrent }) => (
            <div
                data-testid="mock-pokeball-slot"
                data-type={type?.name}
                data-img={pokemonImg}
                data-revealed={isRevealed ? 'true' : 'false'}
                data-current={isCurrent ? 'true' : 'false'}
            >
                {type?.name || 'Default'} - {pokemonImg || 'Empty'}
            </div>
        ),
    };
});

describe('Pokeballs Component Unit Tests', () => {
    test('renders slots for chosen pokeballs plus one active next slot when length < 6', () => {
        const pokeballs = [POKEBALL.NORMAL, POKEBALL.SUPER];
        const team = [{ id: 1, image: { sprite: 'bulbasaur.png' } }];

        render(<Pokeballs pokeballs={pokeballs} team={team} />);

        const slots = screen.getAllByTestId('mock-pokeball-slot');
        // 2 pokeballs + 1 extra placeholder slot = 3
        expect(slots.length).toBe(3);

        expect(slots[0]).toHaveAttribute('data-type', POKEBALL.NORMAL.name);
        expect(slots[0]).toHaveAttribute('data-img', 'bulbasaur.png');
        expect(slots[0]).toHaveAttribute('data-revealed', 'false');
        expect(slots[0]).toHaveAttribute('data-current', 'true');

        expect(slots[1]).toHaveAttribute('data-type', POKEBALL.SUPER.name);
        expect(slots[1]).toHaveAttribute('data-img', '');

        expect(slots[2]).toHaveAttribute('data-type', POKEBALL.NORMAL.name);
    });

    test('marks previous slots as revealed and current slot according to isAnimationFinished', () => {
        const pokeballs = [POKEBALL.NORMAL, POKEBALL.SUPER, POKEBALL.ULTRA];
        const team = [
            { id: 1, image: { sprite: 'poke1.png' } },
            { id: 2, image: { sprite: 'poke2.png' } },
        ];

        const { rerender } = render(
            <Pokeballs pokeballs={pokeballs} team={team} isAnimationFinished={false} />
        );

        let slots = screen.getAllByTestId('mock-pokeball-slot');
        // Slot 0 (previous) is already revealed
        expect(slots[0]).toHaveAttribute('data-revealed', 'true');
        expect(slots[0]).toHaveAttribute('data-current', 'false');

        // Slot 1 (current) is not yet finished animation
        expect(slots[1]).toHaveAttribute('data-revealed', 'false');
        expect(slots[1]).toHaveAttribute('data-current', 'true');

        // Fast-forward or finish animation
        rerender(
            <Pokeballs pokeballs={pokeballs} team={team} isAnimationFinished={true} />
        );
        slots = screen.getAllByTestId('mock-pokeball-slot');
        expect(slots[0]).toHaveAttribute('data-revealed', 'true');
        expect(slots[1]).toHaveAttribute('data-revealed', 'true');
    });

    test('renders 7 slots (6 chosen + 1 extra) when 6 pokeballs are provided', () => {
        const pokeballs = Array(6).fill(POKEBALL.MASTER);
        const team = Array(6).fill(null).map((_, i) => ({ id: i + 1, image: { sprite: `poke${i + 1}.png` } }));

        render(<Pokeballs pokeballs={pokeballs} team={team} />);

        const slots = screen.getAllByTestId('mock-pokeball-slot');
        expect(slots.length).toBe(7);
    });

    test('renders single slot by default when no props provided', () => {
        render(<Pokeballs />);
        const slots = screen.getAllByTestId('mock-pokeball-slot');
        expect(slots.length).toBe(1);
    });
});
