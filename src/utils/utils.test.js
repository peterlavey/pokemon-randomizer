import {
    delay,
    getRandom,
    getByTier,
    getPokeballByTier,
    isIOS,
    preloadAudio,
    preloadAudioIos,
} from './utils';
import * as pokemonService from '../services/pokemonService';
import { POKEBALL, TIER } from '../constants/gameConstants';
import { Howl } from 'howler';

jest.mock('howler', () => ({
    Howl: jest.fn().mockImplementation((config) => ({
        ...config,
        play: jest.fn(),
        pause: jest.fn(),
        stop: jest.fn(),
    })),
}));

describe('utils.js Unit Tests', () => {
    describe('delay', () => {
        test('resolves after specified milliseconds', async () => {
            jest.useFakeTimers();
            const promise = delay(100);
            jest.advanceTimersByTime(100);
            await expect(promise).resolves.toBeUndefined();
            jest.useRealTimers();
        });

        test('resolves with default 0ms when no argument provided', async () => {
            jest.useFakeTimers();
            const promise = delay();
            jest.advanceTimersByTime(0);
            await expect(promise).resolves.toBeUndefined();
            jest.useRealTimers();
        });
    });

    describe('getRandom', () => {
        test('returns an item from the array', () => {
            const items = ['bulbasaur', 'charmander', 'squirtle'];
            const result = getRandom(items);
            expect(items).toContain(result);
        });

        test('returns null for empty array', () => {
            expect(getRandom([])).toBeNull();
        });
    });

    describe('getByTier', () => {
        test('delegates to pokemonService.getPokemonsByTiers', () => {
            const spy = jest.spyOn(pokemonService, 'getPokemonsByTiers').mockReturnValue([{ id: 1 }]);
            const result = getByTier(TIER.S);
            expect(spy).toHaveBeenCalledWith(TIER.S);
            expect(result).toEqual([{ id: 1 }]);
            spy.mockRestore();
        });
    });

    describe('getPokeballByTier', () => {
        test('delegates to pokemonService.getPokeballByTier', () => {
            const spy = jest.spyOn(pokemonService, 'getPokeballByTier').mockReturnValue(POKEBALL.MASTER);
            const result = getPokeballByTier(TIER.S);
            expect(spy).toHaveBeenCalledWith(TIER.S);
            expect(result).toBe(POKEBALL.MASTER);
            spy.mockRestore();
        });
    });

    describe('isIOS', () => {
        const originalNavigator = window.navigator;

        afterEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: originalNavigator,
                configurable: true,
                writable: true,
            });
            delete document.ontouchend;
        });

        test('returns true for iPhone platform', () => {
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'iPhone', userAgent: 'iPhone' },
                configurable: true,
            });
            expect(isIOS()).toBe(true);
        });

        test('returns true for iPad platform', () => {
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'iPad', userAgent: 'iPad' },
                configurable: true,
            });
            expect(isIOS()).toBe(true);
        });

        test('returns true for iPod platform', () => {
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'iPod', userAgent: 'iPod' },
                configurable: true,
            });
            expect(isIOS()).toBe(true);
        });

        test('returns true for Mac userAgent with touch events (iPad Pro)', () => {
            document.ontouchend = () => {};
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'MacIntel', userAgent: 'Macintosh' },
                configurable: true,
            });
            expect(isIOS()).toBe(true);
        });

        test('returns false for standard Mac without touch points', () => {
            delete document.ontouchend;
            Object.defineProperty(window, 'navigator', {
                value: { platform: 'MacIntel', userAgent: 'Macintosh' },
                configurable: true,
            });
            expect(isIOS()).toBe(false);
        });

        test('returns false when navigator is undefined', () => {
            Object.defineProperty(window, 'navigator', {
                value: undefined,
                configurable: true,
            });
            expect(isIOS()).toBe(false);
        });
    });

    describe('preloadAudio', () => {
        const originalAudio = window.Audio;

        beforeEach(() => {
            window.Audio = jest.fn().mockImplementation(() => {
                const listeners = {};
                return {
                    addEventListener: (event, cb) => {
                        listeners[event] = cb;
                        // trigger immediately in next tick
                        setTimeout(() => {
                            if (listeners['canplaythrough']) {
                                listeners['canplaythrough']();
                            }
                        }, 0);
                    },
                    removeEventListener: jest.fn(),
                    src: '',
                };
            });
        });

        afterEach(() => {
            window.Audio = originalAudio;
        });

        test('creates Audio objects and handles canplaythrough event', async () => {
            const sounds = ['sound1.mp3', 'sound2.mp3'];
            const audios = await preloadAudio(sounds);
            expect(audios.length).toBe(2);
            expect(audios[0].src).toBe('sound1.mp3');
            expect(audios[1].src).toBe('sound2.mp3');
        });
    });

    describe('preloadAudioIos', () => {
        test('creates single Howl instance when string passed', () => {
            const howl = preloadAudioIos('cry.mp3');
            expect(Howl).toHaveBeenCalledWith({ src: ['cry.mp3'], html5: true });
            expect(howl).toBeDefined();
        });

        test('creates array of Howl instances when array passed', () => {
            const howls = preloadAudioIos(['cry1.mp3', 'cry2.mp3']);
            expect(Array.isArray(howls)).toBe(true);
            expect(howls.length).toBe(2);
        });
    });
});
