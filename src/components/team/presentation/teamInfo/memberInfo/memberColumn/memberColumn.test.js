import { render } from '@testing-library/react';
import MemberColumn from './memberColumn';

describe('MemberColumn Component', () => {
    test('renders correct active column indicator for different IDs', () => {
        // ID 1 -> Column 0 active
        const { container: c1 } = render(<MemberColumn id={1} />);
        const col1Divs = c1.querySelectorAll('.memberColumn > div');
        expect(col1Divs[0].textContent).toBe('1');
        expect(col1Divs[1].className).toBe('active');
        expect(col1Divs[2].className).toBe('inactive');
        expect(col1Divs[3].className).toBe('inactive');

        // ID 2 -> Column 1 active
        const { container: c2 } = render(<MemberColumn id={2} />);
        const col2Divs = c2.querySelectorAll('.memberColumn > div');
        expect(col2Divs[0].textContent).toBe('2');
        expect(col2Divs[1].className).toBe('inactive');
        expect(col2Divs[2].className).toBe('active');
        expect(col2Divs[3].className).toBe('inactive');

        // ID 3 -> Column 2 active
        const { container: c3 } = render(<MemberColumn id={3} />);
        const col3Divs = c3.querySelectorAll('.memberColumn > div');
        expect(col3Divs[0].textContent).toBe('3');
        expect(col3Divs[1].className).toBe('inactive');
        expect(col3Divs[2].className).toBe('inactive');
        expect(col3Divs[3].className).toBe('active');
    });
});
