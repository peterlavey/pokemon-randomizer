import pokemons from "../resources/pokemons.json";

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export const getByTier = tiers => pokemons.filter((pokemon) => ~tiers.indexOf(pokemon.tier));