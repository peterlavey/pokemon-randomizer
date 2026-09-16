import React from 'react';
import { render, screen } from '@testing-library/react';
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
});
