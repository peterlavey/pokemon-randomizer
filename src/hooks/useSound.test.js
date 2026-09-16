import React from 'react';
import { renderHook } from '@testing-library/react';
import { useSound } from './useSound';
import { SoundContextProvider } from '../contexts/soundContext';

describe('useSound hook', () => {
    test('returns sound context values', () => {
        const wrapper = ({ children }) => (
            <SoundContextProvider>{children}</SoundContextProvider>
        );

        const { result } = renderHook(() => useSound(), { wrapper });

        expect(result.current.ready).toBe(true);
        expect(result.current.soundOn).toBe(false);
        expect(typeof result.current.toggleSound).toBe('function');
        expect(typeof result.current.playTick).toBe('function');
        expect(typeof result.current.playOpen).toBe('function');
    });
});
