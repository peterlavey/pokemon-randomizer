export const delay = ms => new Promise(res => setTimeout(res, ms));

export const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];