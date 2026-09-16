import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Carousel from './carousel';
import { POKEBALL } from '../../../../constants/gameConstants';
import * as soundContextModule from '../../../../contexts/soundContext';

describe('Carousel Component Unit Tests', () => {
    let mockPlayTick;

    beforeEach(() => {
        jest.useFakeTimers();
        mockPlayTick = jest.fn();
        jest.spyOn(soundContextModule, 'useSoundContext').mockReturnValue({
            playTick: mockPlayTick,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('renders pokeball item with image and roulette items inside track', () => {
        const onSelectMock = jest.fn();
        const { container } = render(
            <Carousel pokeball={POKEBALL.NORMAL} onSelect={onSelectMock} />
        );

        expect(container.querySelector('#Pokeball')).toBeInTheDocument();
        const rouletteTrack = container.querySelector('.roulette .rouletteTrack');
        expect(rouletteTrack).toBeInTheDocument();
        const rouletteImages = container.querySelectorAll('.roulette img');
        expect(rouletteImages.length).toBeGreaterThan(0);
    });

    test('handles click: sets selected class, plays tick, calls onSelect and resets class after timeout', () => {
        const onSelectMock = jest.fn();
        const { container } = render(
            <Carousel pokeball={POKEBALL.MASTER} onSelect={onSelectMock} />
        );

        const carouselItem = container.querySelector('.pokeballItem');
        expect(carouselItem).not.toHaveClass('MasterballSelected');

        fireEvent.click(carouselItem);
        expect(carouselItem).toHaveClass('MasterballSelected');
        expect(mockPlayTick).toHaveBeenCalledTimes(1);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.MASTER);

        // Advance timer past 450ms
        act(() => {
            jest.advanceTimersByTime(450);
        });
        expect(carouselItem).not.toHaveClass('MasterballSelected');
    });

    test('handles keyboard Enter and Space keys to select pokeball', () => {
        const onSelectMock = jest.fn();
        const { container } = render(
            <Carousel pokeball={POKEBALL.SUPER} onSelect={onSelectMock} />
        );

        const carouselItem = container.querySelector('.pokeballItem');

        fireEvent.keyDown(carouselItem, { key: 'Enter' });
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.SUPER);
        expect(mockPlayTick).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(carouselItem, { key: ' ' });
        expect(onSelectMock).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(carouselItem, { key: 'ArrowDown' });
        expect(onSelectMock).toHaveBeenCalledTimes(2);
    });
});
