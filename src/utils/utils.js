import {
    getPokemonsByTiers,
    getPokeballByTier as getPokeballByTierService,
    getRandomItem,
    getAllPokemons,
    getPokemonById,
    getRandomTeam,
    createPresentationTeamState
} from "../services/pokemonService";
import { TEAM_SIZE } from "../constants/gameConstants";
import { Howl } from "howler";

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getRandom = (arr) => getRandomItem(arr);

export const getByTier = (tiers) => getPokemonsByTiers(tiers);

export const getPokeballByTier = (tier) => getPokeballByTierService(tier);

export const isIOS = () => {
    if (typeof navigator === "undefined") return false;
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
        (navigator.userAgent.includes("Mac") && typeof document !== "undefined" && "ontouchend" in document)
    );
};

export const preloadAudio = (arr) => new Promise((resolve) => {
    let count = 0;
    let audios = [];

    const audioLoaded = () => {
        count++;
        if (count === arr.length) {
            resolve(audios);
        }
    };

    audios = arr.map((src) => {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', audioLoaded, false);
        audio.src = src;
        return audio;
    });
});

export const preloadAudioIos = (arr) => {
    if (typeof arr === "string") {
        return new Howl({
            src: [arr],
            html5: true
        });
    }

    return arr.map((src) => new Howl({
        src: [src],
        html5: true
    }));
};

export const preloadImage = (src) => {
    if (!src || typeof Image === "undefined") return null;
    try {
        const img = new Image();
        img.src = src;
        return img;
    } catch {
        return null;
    }
};

export const preloadPokemonAssets = (pokemon) => {
    if (!pokemon) return;
    if (pokemon.image?.hires) {
        preloadImage(pokemon.image.hires);
    }
    if (pokemon.image?.sprite) {
        preloadImage(pokemon.image.sprite);
    }
    if (pokemon.cry) {
        try {
            if (typeof Audio !== "undefined") {
                const audio = new Audio();
                audio.preload = "auto";
                audio.src = pokemon.cry;
                if (typeof audio.load === "function") {
                    audio.load();
                }
            } else {
                preloadAudioIos(pokemon.cry);
            }
        } catch {
            // Safely ignore audio preloading errors in restricted environments
        }
    }
};

/**
 * Checks if the URL contains parameters indicating a direct jump to presentation.
 * Supports: ?presentation, ?presentation=true, ?view=presentation, ?mode=presentation,
 * ?stage=presentation, ?screen=presentation, ?skip=presentation, ?hof=true, ?halloffame=true
 * 
 * @param {string} [search] - Optional search query string (defaults to window.location.search)
 * @returns {boolean}
 */
export const isPresentationUrlParam = (search) => {
    const searchString = typeof search === 'string'
        ? search
        : (typeof window !== 'undefined' && window.location ? window.location.search : '');

    if (!searchString) return false;

    try {
        const params = new URLSearchParams(searchString);

        if (params.has('presentation')) {
            const val = params.get('presentation')?.toLowerCase();
            if (val !== 'false' && val !== '0') return true;
        }

        if (params.has('hof')) {
            const val = params.get('hof')?.toLowerCase();
            if (val !== 'false' && val !== '0') return true;
        }

        if (params.has('halloffame')) {
            const val = params.get('halloffame')?.toLowerCase();
            if (val !== 'false' && val !== '0') return true;
        }

        if (params.has('hall-of-fame')) {
            const val = params.get('hall-of-fame')?.toLowerCase();
            if (val !== 'false' && val !== '0') return true;
        }

        const queryKeys = ['view', 'mode', 'stage', 'screen', 'skip', 'section'];
        const presentationValues = ['presentation', 'hof', 'halloffame', 'hall-of-fame', 'completed'];

        for (const key of queryKeys) {
            const val = params.get(key)?.toLowerCase();
            if (val && presentationValues.includes(val)) {
                return true;
            }
        }

        return false;
    } catch {
        return false;
    }
};

/**
 * Parses optional Pokémon team identifiers (IDs or English names) from URL query params.
 * e.g. ?team=1,4,7,25,150,151 or ?pokemon=Pikachu,Charizard
 * 
 * @param {string} [search] - Optional search query string
 * @returns {Array|null}
 */
export const getTeamFromUrlParams = (search) => {
    const searchString = typeof search === 'string'
        ? search
        : (typeof window !== 'undefined' && window.location ? window.location.search : '');

    if (!searchString) return null;

    try {
        const params = new URLSearchParams(searchString);
        const teamParam = params.get('team') || params.get('pokemon') || params.get('pokemons') || params.get('ids');
        if (!teamParam) return null;

        const identifiers = teamParam.split(',').map((s) => s.trim()).filter(Boolean);
        if (identifiers.length === 0) return null;

        const all = getAllPokemons();
        const selected = [];
        const seenIds = new Set();

        for (const item of identifiers) {
            const numId = parseInt(item, 10);
            const found = !isNaN(numId)
                ? getPokemonById(numId)
                : all.find((p) => p.name?.english?.toLowerCase() === item.toLowerCase());

            if (found && !seenIds.has(found.id)) {
                seenIds.add(found.id);
                selected.push(found);
            }
        }

        return selected.length > 0 ? selected : null;
    } catch {
        return null;
    }
};

/**
 * Constructs an initial presentation team state from URL search params.
 * Preloads assets for all team members.
 * 
 * @param {string} [search] - Optional search query string
 * @returns {Object|null}
 */
export const getInitialTeamStateFromUrl = (search) => {
    if (!isPresentationUrlParam(search)) {
        return null;
    }

    const customTeam = getTeamFromUrlParams(search);
    let team;

    if (customTeam && customTeam.length === TEAM_SIZE) {
        team = customTeam;
    } else if (customTeam && customTeam.length > 0) {
        const existingIds = new Set(customTeam.map((p) => p.id));
        const remaining = getAllPokemons().filter((p) => !existingIds.has(p.id));
        const needed = TEAM_SIZE - customTeam.length;
        const pool = [...remaining];
        const extra = [];
        for (let i = 0; i < needed && pool.length > 0; i++) {
            const index = Math.floor(Math.random() * pool.length);
            const [pokemon] = pool.splice(index, 1);
            extra.push(pokemon);
        }
        team = [...customTeam, ...extra];
    } else {
        team = getRandomTeam(TEAM_SIZE);
    }

    team.forEach((pokemon) => preloadPokemonAssets(pokemon));
    return createPresentationTeamState(team);
};
