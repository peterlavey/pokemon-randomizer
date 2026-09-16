import { render, screen, fireEvent } from '@testing-library/react';
import ChoosePokeballs from './choosePokeballs';
import { POKEBALL } from '../../../constants/gameConstants';

describe('ChoosePokeballs Component', () => {
    test('renders 4 pokeball carousels and triggers onSelectPokeball when clicked', () => {
        const onSelectMock = jest.fn();
        const { container } = render(
            <ChoosePokeballs onSelectPokeball={onSelectMock} />
        );

        const carousels = container.querySelectorAll('.pokeballItem');
        expect(carousels.length).toBe(4);

        const masterball = container.querySelector('#Masterball');
        expect(masterball).toBeInTheDocument();

        fireEvent.click(masterball);
        expect(onSelectMock).toHaveBeenCalledWith(POKEBALL.MASTER);
    });
});
