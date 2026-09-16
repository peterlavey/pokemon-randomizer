import {
    getPokemonsByTiers,
    getPokeballByTier as getPokeballByTierService,
    getRandomItem
} from "../services/pokemonService";
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
