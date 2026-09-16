import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoosePokeballs from './choosePokeballs';
import { POKEBALL } from '../../../constants/gameConstants';

describe('ChoosePokeballs Component Unit Tests', () => {
    test('renders 4 pokeball carousels and triggers onSelectPokeball when each is clicked', () => {
        const onSelectMock = jest.fn();
        const { container } = render(
            <ChoosePokeballs onSelectPokeball={onSelectMock} />
        );

        const carousels = container.querySelectorAll('.pokeballItem');
        expect(carousels.length).toBe(4);

        // Click Pokeball (Normal)
        const pokeball = container.querySelector('#Pokeball');
        expect(pokeball).toBeInTheDocument();
        fireEvent.click(pokeball);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.NORMAL);

        // Click Superball
        const superball = container.querySelector('#Superball');
        expect(superball).toBeInTheDocument();
        fireEvent.click(superball);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.SUPER);

        // Click Ultraball
        const ultraball = container.querySelector('#Ultraball');
        expect(ultraball).toBeInTheDocument();
        fireEvent.click(ultraball);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.ULTRA);

        // Click Masterball
        const masterball = container.querySelector('#Masterball');
        expect(masterball).toBeInTheDocument();
        fireEvent.click(masterball);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.MASTER);

        expect(onSelectMock).toHaveBeenCalledTimes(4);
    });
});
