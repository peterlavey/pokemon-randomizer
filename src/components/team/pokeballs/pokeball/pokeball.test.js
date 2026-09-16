import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Pokeball from './pokeball';
import { POKEBALL } from '../../../../constants/gameConstants';

describe('Pokeball Component Unit Tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders with default normal pokeball when no props provided', () => {
        const { container } = render(<Pokeball />);
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', POKEBALL.NORMAL.img);
        expect(img).toHaveAttribute('alt', POKEBALL.NORMAL.name);
        expect(img).not.toHaveClass('catch');
        expect(container.querySelectorAll('img').length).toBe(1);
    });

    test('renders specific pokeball type like Masterball', () => {
        const { container } = render(<Pokeball type={POKEBALL.MASTER} />);
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', POKEBALL.MASTER.img);
        expect(img).toHaveAttribute('alt', POKEBALL.MASTER.name);
    });

    test('transitions to catching and renders caught pokemon when pokemonImg is provided', async () => {
        const { container } = render(
            <Pokeball type={POKEBALL.ULTRA} pokemonImg="pikachu_sprite.png" />
        );

        const pokeballImg = container.querySelector('img');
        expect(pokeballImg).not.toHaveClass('catch');
        expect(container.querySelectorAll('img').length).toBe(1);

        // Advance 4000ms for isCatching
        await act(async () => {
            jest.advanceTimersByTime(4000);
        });
        expect(pokeballImg).toHaveClass('catch');
        expect(container.querySelectorAll('img').length).toBe(1);

        // Advance another 500ms for pokemonCatched
        await act(async () => {
            jest.advanceTimersByTime(500);
        });
        const images = container.querySelectorAll('img');
        expect(images.length).toBe(2);
        expect(images[1]).toHaveAttribute('src', 'pikachu_sprite.png');
        expect(images[1]).toHaveClass('pokemon');
    });

    test('cleans up timers and unmounts safely', () => {
        const { unmount } = render(
            <Pokeball type={POKEBALL.NORMAL} pokemonImg="sprite.png" />
        );
        expect(() => unmount()).not.toThrow();
    });
});
