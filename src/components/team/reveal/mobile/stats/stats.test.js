import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Stats from './stats';

jest.mock('./radar/radar', () => ({ stats }) => (
    <div data-testid="mock-radar-in-stats">HP: {stats?.hp}</div>
));

describe('Stats Component Unit Tests', () => {
    test('renders stats container with Radar component', () => {
        const stats = { hp: 100, attack: 50 };
        const { container } = render(<Stats stats={stats} />);

        expect(container.querySelector('.stats')).toBeInTheDocument();
        expect(screen.getByTestId('mock-radar-in-stats')).toHaveTextContent('HP: 100');
    });

    test('renders base stats bars with labels, values and BST calculation', () => {
        const stats = {
            hp: 45,
            attack: 49,
            defense: 49,
            spAttack: 65,
            spDefense: 65,
            speed: 45
        };
        render(<Stats stats={stats} />);

        expect(screen.getByText('BASE STATS')).toBeInTheDocument();
        expect(screen.getByText('HP')).toBeInTheDocument();
        expect(screen.getByText('ATK')).toBeInTheDocument();
        expect(screen.getByText('DEF')).toBeInTheDocument();
        expect(screen.getByText('SP.ATK')).toBeInTheDocument();
        expect(screen.getByText('SP.DEF')).toBeInTheDocument();
        expect(screen.getByText('SPD')).toBeInTheDocument();

        // BST Total is 45 + 49 + 49 + 65 + 65 + 45 = 318
        expect(screen.getAllByText('318').length).toBeGreaterThanOrEqual(1);
    });

    test('toggles between bars view and radar view', () => {
        const stats = { hp: 80, attack: 100 };
        render(<Stats stats={stats} />);

        const radarTabBtn = screen.getByRole('tab', { name: /radar/i });
        const barsTabBtn = screen.getByRole('tab', { name: /bars/i });

        // Initially bars view is active
        expect(barsTabBtn).toHaveAttribute('aria-selected', 'true');
        expect(radarTabBtn).toHaveAttribute('aria-selected', 'false');

        // Switch to radar tab
        fireEvent.click(radarTabBtn);
        expect(radarTabBtn).toHaveAttribute('aria-selected', 'true');
        expect(barsTabBtn).toHaveAttribute('aria-selected', 'false');

        // Switch back to bars tab
        fireEvent.click(barsTabBtn);
        expect(barsTabBtn).toHaveAttribute('aria-selected', 'true');
    });

    test('returns null when stats is not provided', () => {
        const { container } = render(<Stats stats={null} />);
        expect(container.firstChild).toBeNull();
    });
});
