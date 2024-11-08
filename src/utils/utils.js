import pokemons from "../resources/pokemons.json";

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export const getByTier = tiers => pokemons.filter((pokemon) => ~tiers.indexOf(pokemon.tier));

export const isIOS = () => [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)