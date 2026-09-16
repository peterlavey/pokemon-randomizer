import React from 'react';
import { render, screen } from '@testing-library/react';
import Type from './type';

describe('Type Component Unit Tests', () => {
    test('renders type label and applies corresponding background class', () => {
        const { container } = render(<Type type="Fire" />);
        const span = screen.getByText('Fire');
        expect(span).toBeInTheDocument();
        expect(span).toHaveClass('type');
        expect(span).toHaveClass('bg-fire');
    });

    test('handles types with mixed case like Grass', () => {
        const { container } = render(<Type type="Grass" />);
        const span = screen.getByText('Grass');
        expect(span).toHaveClass('bg-grass');
    });
});
