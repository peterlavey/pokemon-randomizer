import React from 'react';
import { render, screen } from '@testing-library/react';
import Radar from './radar';

jest.mock('react-chartjs-2', () => ({
    Radar: ({ data, options }) => (
        <div data-testid="mock-radar" data-labels={JSON.stringify(data.labels)}>
            <span data-testid="stat-values">{JSON.stringify(data.datasets[0].data)}</span>
        </div>
    ),
}));

describe('Radar Component Unit Tests', () => {
    test('returns null when stats is not provided', () => {
        const { container } = render(<Radar stats={null} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders radar chart with calculated percentages for provided stats', () => {
        const stats = {
            hp: 45,
            attack: 49,
            defense: 49,
            speed: 45,
            spDefense: 65,
            spAttack: 65,
        };

        render(<Radar stats={stats} />);
        const radarElement = screen.getByTestId('mock-radar');
        expect(radarElement).toBeInTheDocument();

        const labels = JSON.parse(radarElement.getAttribute('data-labels'));
        expect(labels).toEqual(['HP', 'Attack', 'Defense', 'Speed', 'Sp.Def', 'Sp.Atk']);

        const statValues = JSON.parse(screen.getByTestId('stat-values').textContent);
        expect(statValues.length).toBe(6);
        expect(statValues[0]).toBeGreaterThan(0);
    });

    test('handles default 0 values when stats properties are missing', () => {
        render(<Radar stats={{}} />);
        const statValues = JSON.parse(screen.getByTestId('stat-values').textContent);
        expect(statValues).toEqual([0, 0, 0, 0, 0, 0]);
    });
});
