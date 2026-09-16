import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Team from './team';
import { SoundContextProvider } from '../../contexts/soundContext';

describe('Team Component Integration', () => {
    test('full user flow from selecting pokeballs to presentation', async () => {
        const { container } = render(
            <SoundContextProvider>
                <Team />
            </SoundContextProvider>
        );

        // 1. Initial State: CHOOSE
        expect(container.querySelector('.choosePokeballs')).toBeInTheDocument();
        const masterball = container.querySelector('#Masterball');

        // Select 6 Masterballs
        for (let i = 0; i < 6; i++) {
            fireEvent.click(masterball);
        }

        // 2. State: OPEN (PokeButton appears)
        await waitFor(() => {
            expect(container.querySelector('.pokeButton')).toBeInTheDocument();
        });

        // Click PokeButton to open the first pokeball
        const pokeButton = container.querySelector('.pokeButton');
        fireEvent.click(pokeButton);

        // 3. State: REVEAL (Reveal / Mobile view appears)
        await waitFor(() => {
            expect(container.querySelector('.reveal')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Dismiss reveal
        const reveal = container.querySelector('.reveal');
        fireEvent.click(reveal);

        // 4. Back to OPEN for slot 2
        await waitFor(() => {
            expect(container.querySelector('.pokeButton')).toBeInTheDocument();
        });
    });
});
