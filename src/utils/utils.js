import pokemons from "../resources/pokemons.json";
import {POKEBALL} from "../components/team/pokeballs/pokeball/pokeball";
import {Howl} from "howler";

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export const getByTier = tiers => pokemons.filter((pokemon) => ~tiers.indexOf(pokemon.tier));

export const getPokeballByTier = tier => Object.values(POKEBALL).find(({tiers}) => tiers.includes(tier));

export const isIOS = () => [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

export const preloadAudio = arr => new Promise(resolve => {
    let count = 0;
    let audios = [];

    const audioLoaded = () => {
        count++;
        if(count === arr.length) {
            resolve(audios);
        }
    };

    audios = arr.map(src => {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', audioLoaded, false);
        audio.src = src;
        return audio;
    });
});

export const preloadAudioIos = arr => arr.map(src => new Howl({
    src: [src],
    html5: true
}));