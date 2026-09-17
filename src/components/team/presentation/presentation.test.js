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
        expect(charizardImg.style.top).toBe('15%');

        const pikachuImg = screen.getByAltText('Pikachu');
        expect(pikachuImg.style.top).toBe('45%');

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

    test('positions ground and flying pokemons independently so ground pokemons fill space under flying pokemons', () => {
        const teamWithFlyingAndGround = [
            { id: 150, name: { english: 'Mewtwo' }, height: 2.0, isFlying: false, image: { hires: '150.png' }, cry: '150.mp3' },
            { id: 68, name: { english: 'Machamp' }, height: 1.6, isFlying: false, image: { hires: '68.png' }, cry: '68.mp3' },
            { id: 42, name: { english: 'Golbat' }, height: 1.6, isFlying: true, image: { hires: '42.png' }, cry: '42.mp3' },
            { id: 15, name: { english: 'Beedrill' }, height: 1.0, isFlying: true, image: { hires: '15.png' }, cry: '15.mp3' },
            { id: 73, name: { english: 'Tentacruel' }, height: 1.6, isFlying: false, image: { hires: '73.png' }, cry: '73.mp3' },
            { id: 29, name: { english: 'NidoranF' }, height: 0.4, isFlying: false, image: { hires: '29.png' }, cry: '29.mp3' },
        ];

        render(<Presentation team={teamWithFlyingAndGround} />);

        const golbatImg = screen.getByAltText('Golbat');
        const beedrillImg = screen.getByAltText('Beedrill');
        const mewtwoImg = screen.getByAltText('Mewtwo');
        const machampImg = screen.getByAltText('Machamp');
        const tentacruelImg = screen.getByAltText('Tentacruel');
        const nidoranImg = screen.getByAltText('NidoranF');

        // Flying pokemons in the air
        expect(golbatImg.style.top).toBe('15%');
        expect(beedrillImg.style.top).toBe('15%');
        expect(beedrillImg.style.left).toBe('38%');
        expect(golbatImg.style.left).toBe('62%');

        // 4 ground pokemons distributed evenly across the bottom space
        expect(mewtwoImg.style.left).toBe('20%');
        expect(machampImg.style.left).toBe('40%');
        expect(tentacruelImg.style.left).toBe('60%');
        expect(nidoranImg.style.left).toBe('80%');
    });

    test('handles empty team without crashing', () => {
        const { container } = render(<Presentation team={[]} />);
        expect(container.querySelector('.presentation')).toBeInTheDocument();
        expect(screen.getByTestId('mock-team-info')).toHaveTextContent('Team members: 0');
    });
});
