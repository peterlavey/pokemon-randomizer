import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MemberInfo from './memberInfo';
import * as utils from '../../../../../utils/utils';
import { TIER } from '../../../../../constants/gameConstants';

describe('MemberInfo Component Unit Tests', () => {
    let mockHowl;

    beforeEach(() => {
        mockHowl = {
            play: jest.fn(),
            seek: jest.fn(),
        };
        jest.spyOn(utils, 'preloadAudioIos').mockReturnValue(mockHowl);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockMember = {
        id: 6,
        name: { english: 'Charizard' },
        tier: TIER.S,
        type: ['Fire', 'Flying'],
        image: { sprite: 'charizard_sprite.png' },
        cry: 'charizard_cry.mp3',
    };

    test('renders pokemon info, badge, sprite, and types', () => {
        const { container } = render(<MemberInfo {...mockMember} />);

        // Pokeball badge
        const pokeballImg = container.querySelector('.firstColumn img.pokeball');
        expect(pokeballImg).toBeInTheDocument();

        // Sprite and name
        const spriteImg = container.querySelector('.secondColumn img');
        expect(spriteImg).toHaveAttribute('src', 'charizard_sprite.png');
        expect(screen.getByText('Charizard')).toBeInTheDocument();

        // Types
        expect(screen.getByText('Fire')).toBeInTheDocument();
        expect(screen.getByText('Flying')).toBeInTheDocument();

        // Member Column active indicator
        const memberColumn = container.querySelector('.memberColumn');
        expect(memberColumn).toBeInTheDocument();
    });

    test('plays cry on click and on keydown (Enter and Space) and triggers onPlayCry', () => {
        const onPlayCryMock = jest.fn();
        const { container } = render(<MemberInfo {...mockMember} onPlayCry={onPlayCryMock} />);
        const memberDiv = container.querySelector('.memberInfo');
        const spriteImg = container.querySelector('.secondColumn img');

        // Click
        fireEvent.click(memberDiv);
        expect(mockHowl.seek).toHaveBeenCalledWith(0);
        expect(mockHowl.play).toHaveBeenCalledTimes(1);
        expect(onPlayCryMock).toHaveBeenCalledWith(6);
        expect(container.querySelector('.secondColumn img').className).toContain('crying');

        // Enter key
        fireEvent.keyDown(memberDiv, { key: 'Enter' });
        expect(mockHowl.play).toHaveBeenCalledTimes(2);
        expect(onPlayCryMock).toHaveBeenCalledTimes(2);

        // Space key
        fireEvent.keyDown(memberDiv, { key: ' ' });
        expect(mockHowl.play).toHaveBeenCalledTimes(3);
        expect(onPlayCryMock).toHaveBeenCalledTimes(3);

        // Other key
        fireEvent.keyDown(memberDiv, { key: 'Tab' });
        expect(mockHowl.play).toHaveBeenCalledTimes(3);
        expect(onPlayCryMock).toHaveBeenCalledTimes(3);
    });

    test('renders crying class on sprite when isCrying is true', () => {
        const { container } = render(<MemberInfo {...mockMember} isCrying={true} />);
        const spriteImg = container.querySelector('.secondColumn img');
        expect(spriteImg.className).toContain('crying');
    });

    test('handles standard HTML audio with currentTime and play', () => {
        const mockHtmlAudio = {
            currentTime: 5,
            play: jest.fn(),
        };
        utils.preloadAudioIos.mockReturnValue(mockHtmlAudio);

        const { container } = render(<MemberInfo {...mockMember} />);
        const memberDiv = container.querySelector('.memberInfo');

        fireEvent.click(memberDiv);
        expect(mockHtmlAudio.currentTime).toBe(0);
        expect(mockHtmlAudio.play).toHaveBeenCalled();
    });

    test('handles member without cry audio gracefully', () => {
        const noCryMember = { ...mockMember, cry: null };
        const { container } = render(<MemberInfo {...noCryMember} />);
        const memberDiv = container.querySelector('.memberInfo');

        // Should not crash
        fireEvent.click(memberDiv);
    });
});
