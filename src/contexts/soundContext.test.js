import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SoundContextProvider, useSoundContext } from './soundContext';
import * as utils from '../utils/utils';

describe('soundContext Unit Tests', () => {
    let mockAudios;

    beforeEach(() => {
        mockAudios = [
            { play: jest.fn(), pause: jest.fn(), seek: jest.fn(), currentTime: 0 },
            { play: jest.fn(), pause: jest.fn(), seek: jest.fn(), currentTime: 0 },
            { play: jest.fn(), pause: jest.fn(), seek: jest.fn(), currentTime: 0 },
            { play: jest.fn(), pause: jest.fn(), seek: jest.fn(), currentTime: 0 },
        ];
        jest.spyOn(utils, 'preloadAudioIos').mockReturnValue(mockAudios);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const TestConsumer = () => {
        const sound = useSoundContext();
        return (
            <div>
                <span data-testid="ready">{sound.ready ? 'ready' : 'not-ready'}</span>
                <span data-testid="soundOn">{sound.soundOn ? 'sound-on' : 'sound-off'}</span>
                <button onClick={sound.toggleSound}>Toggle</button>
                <button onClick={sound.playTick}>Tick</button>
                <button onClick={sound.playOpen}>Open</button>
                <button onClick={sound.playIntro}>Intro</button>
                <button onClick={sound.pauseIntro}>PauseIntro</button>
                <button onClick={sound.playTeamComplete}>TeamComplete</button>
            </div>
        );
    };

    test('initializes and provides sound controls', () => {
        render(
            <SoundContextProvider>
                <TestConsumer />
            </SoundContextProvider>
        );

        expect(screen.getByTestId('ready').textContent).toBe('ready');
        expect(screen.getByTestId('soundOn').textContent).toBe('sound-off');
    });

    test('toggleSound turns sound on/off and plays/pauses introSong', () => {
        render(
            <SoundContextProvider>
                <TestConsumer />
            </SoundContextProvider>
        );

        const toggleBtn = screen.getByText('Toggle');

        // Turn ON
        act(() => {
            toggleBtn.click();
        });
        expect(screen.getByTestId('soundOn').textContent).toBe('sound-on');
        expect(mockAudios[0].play).toHaveBeenCalled();

        // Turn OFF
        act(() => {
            toggleBtn.click();
        });
        expect(screen.getByTestId('soundOn').textContent).toBe('sound-off');
        expect(mockAudios[0].pause).toHaveBeenCalled();
    });

    test('plays tick, open, intro, and teamComplete sounds', () => {
        render(
            <SoundContextProvider>
                <TestConsumer />
            </SoundContextProvider>
        );

        act(() => {
            screen.getByText('Tick').click();
        });
        expect(mockAudios[2].play).toHaveBeenCalled();

        act(() => {
            screen.getByText('Open').click();
        });
        expect(mockAudios[3].play).toHaveBeenCalled();

        act(() => {
            screen.getByText('Intro').click();
        });
        expect(mockAudios[0].play).toHaveBeenCalled();

        act(() => {
            screen.getByText('PauseIntro').click();
        });
        expect(mockAudios[0].pause).toHaveBeenCalled();

        act(() => {
            screen.getByText('TeamComplete').click();
        });
        expect(mockAudios[1].play).toHaveBeenCalled();
    });

    test('handles standard HTMLMediaElement with currentTime and play promise', () => {
        const htmlAudio = {
            currentTime: 10,
            play: jest.fn().mockReturnValue(Promise.resolve()),
            pause: jest.fn(),
        };
        utils.preloadAudioIos.mockReturnValue([htmlAudio, htmlAudio, htmlAudio, htmlAudio]);

        render(
            <SoundContextProvider>
                <TestConsumer />
            </SoundContextProvider>
        );

        act(() => {
            screen.getByText('Tick').click();
        });
        expect(htmlAudio.currentTime).toBe(0);
        expect(htmlAudio.play).toHaveBeenCalled();
    });

    test('handles preloadAudioIos throwing an error gracefully', () => {
        const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        utils.preloadAudioIos.mockImplementation(() => {
            throw new Error('Audio load failed');
        });

        render(
            <SoundContextProvider>
                <TestConsumer />
            </SoundContextProvider>
        );

        expect(screen.getByTestId('ready').textContent).toBe('ready');
        spyWarn.mockRestore();
    });
});
