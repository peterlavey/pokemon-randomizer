import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PokeButton from './pokeButton';
import { POKEBALL } from '../../../constants/gameConstants';
import * as soundContextModule from '../../../contexts/soundContext';

describe('PokeButton Component Unit Tests', () => {
    let mockSoundContext;

    beforeEach(() => {
        jest.useFakeTimers();
        mockSoundContext = {
            playOpen: jest.fn(),
            openSfx: { play: jest.fn() },
        };
        jest.spyOn(soundContextModule, 'useSoundContext').mockReturnValue(mockSoundContext);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('renders pokeball image and pokeball button', () => {
        const onClickMock = jest.fn();
        const { container } = render(
            <PokeButton pokeball={POKEBALL.MASTER} onClick={onClickMock} />
        );

        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', POKEBALL.MASTER.img);
        expect(img).toHaveAttribute('alt', POKEBALL.MASTER.name);

        const buttonElement = container.querySelector('.pokeball__button');
        expect(buttonElement).toBeInTheDocument();
    });

    test('triggers phase cycle (shaking -> blinking -> zooming) and calls onClick', async () => {
        const onClickMock = jest.fn();
        const { container } = render(
            <PokeButton pokeball={POKEBALL.NORMAL} onClick={onClickMock} />
        );

        const pokeButtonDiv = container.querySelector('.pokeButton');
        const shakingContainer = container.querySelector('.shaking');
        const buttonInner = container.querySelector('.pokeball__button');

        expect(shakingContainer).toBeInTheDocument();

        // Click pokeButton
        fireEvent.click(pokeButtonDiv);

        expect(mockSoundContext.playOpen).toHaveBeenCalledTimes(1);

        // Blinking phase immediately starts
        expect(buttonInner).toHaveClass('blink');

        // Advance 500ms -> zooming phase starts
        await act(async () => {
            jest.advanceTimersByTime(500);
        });
        expect(container.querySelector('.zoom')).toBeInTheDocument();

        // Advance 800ms -> finishes and calls onClick
        await act(async () => {
            jest.advanceTimersByTime(800);
        });
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test('supports keyboard navigation via Enter and Space', async () => {
        const onClickMock = jest.fn();
        const { container } = render(
            <PokeButton pokeball={POKEBALL.SUPER} onClick={onClickMock} />
        );

        const pokeButtonDiv = container.querySelector('.pokeButton');
        fireEvent.keyDown(pokeButtonDiv, { key: 'Enter' });

        expect(mockSoundContext.playOpen).toHaveBeenCalledTimes(1);

        await act(async () => {
            jest.advanceTimersByTime(500);
        });
        await act(async () => {
            jest.advanceTimersByTime(800);
        });
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test('handles fallback to direct openSfx.play when playOpen is undefined', () => {
        mockSoundContext.playOpen = undefined;
        const onClickMock = jest.fn();
        const { container } = render(
            <PokeButton pokeball={POKEBALL.ULTRA} onClick={onClickMock} />
        );

        const pokeButtonDiv = container.querySelector('.pokeButton');
        fireEvent.click(pokeButtonDiv);

        expect(mockSoundContext.openSfx.play).toHaveBeenCalledTimes(1);
    });
});
