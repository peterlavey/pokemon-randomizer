import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Presentation from './presentation';
import * as soundContextModule from '../../../contexts/soundContext';

jest.mock('./teamInfo/teamInfo', () => ({ team }) => (
    <div data-testid="mock-team-info">Team members: {team?.length}</div>
));

describe('Presentation Component Unit Tests', () => {
    let mockSoundContext;

    beforeEach(() => {
        jest.useFakeTimers();
        mockSoundContext = {
            pauseIntro: jest.fn(),
            playTeamComplete: jest.fn(),
            introSong: { pause: jest.fn() },
            teamCompleteSong: { play: jest.fn() },
        };
        jest.spyOn(soundContextModule, 'useSoundContext').mockReturnValue(mockSoundContext);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    const mockTeam = [
        { id: 1, name: { english: 'Bulbasaur' }, height: 0.7, image: { hires: 'bulbasaur.png' }, cry: 'cry1.mp3' },
        { id: 6, name: { english: 'Charizard' }, height: 1.7, isFlying: true, image: { hires: 'charizard.png' }, cry: 'cry6.mp3' },
        { id: 25, name: { english: 'Pikachu' }, height: 0.4, isJumping: true, image: { hires: 'pikachu.png' }, cry: 'cry25.mp3' },
    ];

    test('renders lineup images with correct heights, classes, and positions', () => {
        const { container } = render(<Presentation team={mockTeam} />);

        // TeamInfo rendered
        expect(screen.getByTestId('mock-team-info')).toHaveTextContent('Team members: 3');

        // Images rendered
        const images = container.querySelectorAll('.presentation img');
        expect(images.length).toBe(3);

        const charizardImg = screen.getByAltText('Charizard');
        expect(charizardImg.style.top).toBe('5%');

        const pikachuImg = screen.getByAltText('Pikachu');
        expect(pikachuImg.style.top).toBe('25%');

        const bulbasaurImg = screen.getByAltText('Bulbasaur');
        expect(bulbasaurImg.style.top === '' || bulbasaurImg.style.top === 'initial').toBe(true);
    });

    test('plays audio and stadium transition after delay', async () => {
        render(<Presentation team={mockTeam} />);

        // Advance timer past 1000ms delay
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        expect(mockSoundContext.pauseIntro).toHaveBeenCalled();
        expect(mockSoundContext.playTeamComplete).toHaveBeenCalled();
    });

    test('handles fallback to direct introSong and teamCompleteSong methods when helpers are omitted', async () => {
        mockSoundContext.pauseIntro = undefined;
        mockSoundContext.playTeamComplete = undefined;

        render(<Presentation team={mockTeam} />);

        await act(async () => {
            jest.advanceTimersByTime(1000);
        });

        expect(mockSoundContext.introSong.pause).toHaveBeenCalled();
        expect(mockSoundContext.teamCompleteSong.play).toHaveBeenCalled();
    });

    test('handles empty team without crashing', () => {
        const { container } = render(<Presentation team={[]} />);
        expect(container.querySelector('.presentation')).toBeInTheDocument();
        expect(screen.getByTestId('mock-team-info')).toHaveTextContent('Team members: 0');
    });
});
