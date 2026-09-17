import React from 'react';
import { render } from '@testing-library/react';
import Confetti from './confetti';

describe('Confetti Component Unit Tests', () => {
    beforeEach(() => {
        // Mock getContext for canvas
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            scale: jest.fn(),
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders confetti canvas correctly', () => {
        const { getByTestId } = render(<Confetti count={30} />);
        const canvas = getByTestId('confetti-canvas');
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveClass('confetti-canvas');
    });

    test('handles missing 2D context gracefully', () => {
        HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
        const { getByTestId } = render(<Confetti count={10} />);
        expect(getByTestId('confetti-canvas')).toBeInTheDocument();
    });
});
