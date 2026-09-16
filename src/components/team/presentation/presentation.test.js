import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Presentation from './presentation';
import * as soundContextModule from '../../../contexts/soundContext';

jest.mock('./teamInfo/teamInfo', () => ({ team, onPlayCry, activeCryMap }) => (
    <div data-testid="mock-team-info">
        Team members: {team?.length}
        {team?.map((m) => (
            <button
                key={m.id}
                data-testid={`trigger-cry-${m.id}`}
                onClick={() => onPlayCry?.(m.id)}
            >
                Cry {m.id} {activeCryMap?.[m.id] ? '(crying)' : ''}
            </button>
        ))}
    </div>
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

    test('renders lineup images with correct heights, classes, and positions, and renders audio elements without autoPlay', () => {
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

        // Audio elements should not have autoplay enabled
        const audioElements = container.querySelectorAll('.presentation audio');
        expect(audioElements.length).toBe(3);
        audioElements.forEach((audio) => {
            expect(audio.autoplay).toBe(false);
        });
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

    test('triggers cry animation on pokemon click and keydown', () => {
        const { container } = render(<Presentation team={mockTeam} />);
        const bulbasaurImg = screen.getByAltText('Bulbasaur');

        expect(bulbasaurImg.className).not.toContain('crying');

        // Click stage pokemon
        fireEvent.click(bulbasaurImg);
        expect(screen.getByAltText('Bulbasaur').className).toContain('crying');

        // Keydown Enter on stage pokemon
        const pikachuImg = screen.getByAltText('Pikachu');
        fireEvent.keyDown(pikachuImg, { key: 'Enter' });
        expect(screen.getByAltText('Pikachu').className).toContain('crying');
    });

    test('triggers cry animation on stage pokemon when onPlayCry is triggered from TeamInfo', () => {
        render(<Presentation team={mockTeam} />);
        const charizardTrigger = screen.getByTestId('trigger-cry-6');

        fireEvent.click(charizardTrigger);
        expect(screen.getByAltText('Charizard').className).toContain('crying');
    });

    test('handles empty team without crashing', () => {
        const { container } = render(<Presentation team={[]} />);
        expect(container.querySelector('.presentation')).toBeInTheDocument();
        expect(screen.getByTestId('mock-team-info')).toHaveTextContent('Team members: 0');
    });
});
