import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamInfo from './teamInfo';

jest.mock('./memberInfo/memberInfo', () => (props) => (
    <div
        data-testid="mock-member-info"
        data-crying={props.isCrying ? 'true' : 'false'}
        data-crykey={props.cryKey}
        onClick={() => props.onPlayCry?.(props.id)}
    >
        ID: {props.id} - {props.name?.english}
    </div>
));

describe('TeamInfo Component Unit Tests', () => {
    test('renders members sorted by ID in ascending order', () => {
        const team = [
            { id: 25, name: { english: 'Pikachu' } },
            { id: 6, name: { english: 'Charizard' } },
            { id: 150, name: { english: 'Mewtwo' } },
            { id: 1, name: { english: 'Bulbasaur' } },
        ];

        render(<TeamInfo team={team} />);
        const renderedMembers = screen.getAllByTestId('mock-member-info');
        expect(renderedMembers.length).toBe(4);
        expect(renderedMembers[0]).toHaveTextContent('ID: 1 - Bulbasaur');
        expect(renderedMembers[1]).toHaveTextContent('ID: 6 - Charizard');
        expect(renderedMembers[2]).toHaveTextContent('ID: 25 - Pikachu');
        expect(renderedMembers[3]).toHaveTextContent('ID: 150 - Mewtwo');
    });

    test('passes onPlayCry and activeCryMap correctly to members', () => {
        const team = [{ id: 6, name: { english: 'Charizard' } }];
        const onPlayCryMock = jest.fn();
        const { container } = render(
            <TeamInfo team={team} onPlayCry={onPlayCryMock} activeCryMap={{ 6: 1 }} />
        );

        const memberEl = screen.getByTestId('mock-member-info');
        expect(memberEl).toHaveAttribute('data-crying', 'true');
        expect(memberEl).toHaveAttribute('data-crykey', '1');

        memberEl.click();
        expect(onPlayCryMock).toHaveBeenCalledWith(6);
    });

    test('handles empty team array or default param', () => {
        const { container } = render(<TeamInfo />);
        expect(container.querySelector('.teamInfo')).toBeInTheDocument();
        expect(screen.queryAllByTestId('mock-member-info').length).toBe(0);
    });
});
