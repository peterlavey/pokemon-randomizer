import {
    delay,
    getRandom,
    getByTier,
    getPokeballByTier,
    isIOS,
    preloadAudio,
    preloadAudioIos,
    preloadImage,
    preloadPokemonAssets,
    isPresentationUrlParam,
    getTeamFromUrlParams,
    getInitialTeamStateFromUrl,
} from './utils';
import * as pokemonService from '../services/pokemonService';
import { POKEBALL, TIER, TEAM_SIZE, TEAM_STATE } from '../constants/gameConstants';
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
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('resolves after specified milliseconds', async () => {
            const promise = delay(100);
            jest.advanceTimersByTime(100);
            await expect(promise).resolves.toBeUndefined();
        });

        test('resolves with default 0ms when no argument provided', async () => {
            const promise = delay();
            jest.advanceTimersByTime(0);
            await expect(promise).resolves.toBeUndefined();
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

    describe('preloadImage', () => {
        test('returns null when src is falsy', () => {
            expect(preloadImage(null)).toBeNull();
            expect(preloadImage('')).toBeNull();
        });

        test('creates an Image object with assigned src', () => {
            const img = preloadImage('http://example.com/pokemon.png');
            expect(img).toBeDefined();
            expect(img.src).toBe('http://example.com/pokemon.png');
        });
    });

    describe('preloadPokemonAssets', () => {
        const originalAudio = window.Audio;

        beforeEach(() => {
            window.Audio = jest.fn().mockImplementation(() => ({
                preload: '',
                src: '',
                load: jest.fn(),
            }));
        });

        afterEach(() => {
            window.Audio = originalAudio;
        });

        test('does nothing when pokemon is null/undefined', () => {
            expect(() => preloadPokemonAssets(null)).not.toThrow();
        });

        test('preloads hires, sprite and cry when provided', () => {
            const mockPokemon = {
                id: 1,
                image: {
                    hires: 'hires.png',
                    sprite: 'sprite.png',
                },
                cry: 'cry.wav',
            };

            preloadPokemonAssets(mockPokemon);
            expect(window.Audio).toHaveBeenCalled();
        });
    });

    describe('isPresentationUrlParam', () => {
        test('returns true for presentation flags', () => {
            expect(isPresentationUrlParam('?presentation=true')).toBe(true);
            expect(isPresentationUrlParam('?presentation')).toBe(true);
            expect(isPresentationUrlParam('?presentation=1')).toBe(true);
            expect(isPresentationUrlParam('?presentation=random')).toBe(true);
            expect(isPresentationUrlParam('?view=presentation')).toBe(true);
            expect(isPresentationUrlParam('?mode=presentation')).toBe(true);
            expect(isPresentationUrlParam('?stage=presentation')).toBe(true);
            expect(isPresentationUrlParam('?screen=presentation')).toBe(true);
            expect(isPresentationUrlParam('?skip=presentation')).toBe(true);
            expect(isPresentationUrlParam('?hof=true')).toBe(true);
            expect(isPresentationUrlParam('?halloffame=true')).toBe(true);
            expect(isPresentationUrlParam('?hall-of-fame=true')).toBe(true);
        });

        test('returns false when no presentation flag or false value', () => {
            expect(isPresentationUrlParam('')).toBe(false);
            expect(isPresentationUrlParam('?foo=bar')).toBe(false);
            expect(isPresentationUrlParam('?presentation=false')).toBe(false);
            expect(isPresentationUrlParam('?presentation=0')).toBe(false);
            expect(isPresentationUrlParam('?hof=false')).toBe(false);
        });

        test('reads from window.location.search when no argument is provided', () => {
            const originalLocation = window.location;
            delete window.location;
            window.location = new URL('http://localhost:3000/?presentation=true');

            expect(isPresentationUrlParam()).toBe(true);

            window.location = new URL('http://localhost:3000/');
            expect(isPresentationUrlParam()).toBe(false);

            window.location = originalLocation;
        });
    });

    describe('getTeamFromUrlParams', () => {
        test('parses numeric pokemon IDs from url', () => {
            const team = getTeamFromUrlParams('?team=1,4,7');
            expect(team).toBeDefined();
            expect(team.length).toBe(3);
            expect(team[0].id).toBe(1);
            expect(team[1].id).toBe(4);
            expect(team[2].id).toBe(7);
        });

        test('parses pokemon names from url', () => {
            const team = getTeamFromUrlParams('?pokemon=Pikachu,Charizard');
            expect(team).toBeDefined();
            expect(team.length).toBe(2);
            expect(team.some((p) => p.name.english === 'Pikachu')).toBe(true);
            expect(team.some((p) => p.name.english === 'Charizard')).toBe(true);
        });

        test('returns null when no team param is present', () => {
            expect(getTeamFromUrlParams('?presentation=true')).toBeNull();
        });
    });

    describe('getInitialTeamStateFromUrl', () => {
        test('returns null when URL does not have presentation param', () => {
            expect(getInitialTeamStateFromUrl('?other=123')).toBeNull();
        });

        test('returns COMPLETED state with 6 random pokemons when presentation param is present', () => {
            const state = getInitialTeamStateFromUrl('?presentation=true');
            expect(state).toBeDefined();
            expect(state.state).toBe(TEAM_STATE.COMPLETED);
            expect(state.pokemonTeam.length).toBe(TEAM_SIZE);
            expect(state.pokeballs.length).toBe(TEAM_SIZE);
        });

        test('completes team with random pokemons if custom team has fewer than TEAM_SIZE', () => {
            const state = getInitialTeamStateFromUrl('?presentation=true&team=25');
            expect(state).toBeDefined();
            expect(state.state).toBe(TEAM_STATE.COMPLETED);
            expect(state.pokemonTeam.length).toBe(TEAM_SIZE);
            expect(state.pokemonTeam[0].id).toBe(25);
            const uniqueIds = new Set(state.pokemonTeam.map((p) => p.id));
            expect(uniqueIds.size).toBe(TEAM_SIZE);
        });
    });
});
