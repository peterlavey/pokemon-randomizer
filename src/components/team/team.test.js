import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Team from './team';
import { SoundContextProvider } from '../../contexts/soundContext';

describe('Team Component Integration', () => {
    test('renders start screen initially and transitions to CHOOSE upon pressing start', () => {
        const { container } = render(
            <SoundContextProvider>
                <Team />
            </SoundContextProvider>
        );

        expect(container.querySelector('.startScreen')).toBeInTheDocument();
        const startButton = screen.getByRole('button', { name: /press start/i });
        fireEvent.click(startButton);

        expect(container.querySelector('.choosePokeballs')).toBeInTheDocument();
    });

    test('full user flow from selecting pokeballs to presentation', async () => {
        const { container } = render(
            <SoundContextProvider>
                <Team />
            </SoundContextProvider>
        );

        // 0. Start screen -> Press start
        expect(container.querySelector('.startScreen')).toBeInTheDocument();
        const startButton = screen.getByRole('button', { name: /press start/i });
        fireEvent.click(startButton);

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

        // Fast-forward animation, then dismiss reveal
        const reveal = container.querySelector('.reveal');
        const headerPokeballContainers = container.querySelectorAll('.pokeballContainer');
        expect(headerPokeballContainers[0]).not.toHaveClass('revealed');

        fireEvent.click(reveal);
        await waitFor(() => {
            expect(reveal).toHaveClass('revealed');
            expect(headerPokeballContainers[0]).toHaveClass('revealed');
        });
        fireEvent.click(reveal);

        // 4. Back to OPEN for slot 2
        await waitFor(() => {
            expect(container.querySelector('.pokeButton')).toBeInTheDocument();
        });
    });

    test('jumps directly to presentation screen with random pokemons when url param is present', () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = new URL('http://localhost:3000/?presentation=true');

        const { container } = render(
            <SoundContextProvider>
                <Team />
            </SoundContextProvider>
        );

        expect(container.querySelector('.startScreen')).not.toBeInTheDocument();
        expect(container.querySelector('.presentation')).toBeInTheDocument();
        expect(container.querySelectorAll('.pokemon-wrapper').length).toBe(6);

        window.location = originalLocation;
    });

    test('jumps directly to presentation with custom team when specified in url', () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = new URL('http://localhost:3000/?presentation=true&team=1,4,7,25,150,151');

        const { container } = render(
            <SoundContextProvider>
                <Team />
            </SoundContextProvider>
        );

        expect(container.querySelector('.presentation')).toBeInTheDocument();
        expect(container.querySelectorAll('.pokemon-wrapper').length).toBe(6);

        window.location = originalLocation;
    });
});
