import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sound from './sound';
import { SoundContextProvider } from '../../../contexts/soundContext';
import * as soundContextModule from '../../../contexts/soundContext';
import { IMG_SOUND_OFF, IMG_SOUND_ON } from '../../../constants/gameConstants';

describe('Sound Component Unit Tests', () => {
    test('renders sound on icon when soundOn is true and handles click', () => {
        const toggleMock = jest.fn();
        jest.spyOn(soundContextModule, 'useSoundContext').mockReturnValue({
            soundOn: true,
            toggleSound: toggleMock,
        });

        render(<Sound />);
        const img = screen.getByRole('button');
        expect(img).toHaveAttribute('src', IMG_SOUND_ON);
        expect(img).toHaveAttribute('alt', 'Mute sound');

        fireEvent.click(img);
        expect(toggleMock).toHaveBeenCalledTimes(1);

        jest.restoreAllMocks();
    });

    test('renders sound off icon when soundOn is false and handles Enter / Space keydown', () => {
        const toggleMock = jest.fn();
        jest.spyOn(soundContextModule, 'useSoundContext').mockReturnValue({
            soundOn: false,
            toggleSound: toggleMock,
        });

        render(<Sound />);
        const img = screen.getByRole('button');
        expect(img).toHaveAttribute('src', IMG_SOUND_OFF);
        expect(img).toHaveAttribute('alt', 'Enable sound');

        fireEvent.keyDown(img, { key: 'Enter' });
        expect(toggleMock).toHaveBeenCalledTimes(1);

        fireEvent.keyDown(img, { key: ' ' });
        expect(toggleMock).toHaveBeenCalledTimes(2);

        fireEvent.keyDown(img, { key: 'Tab' });
        expect(toggleMock).toHaveBeenCalledTimes(2);

        jest.restoreAllMocks();
    });
});
