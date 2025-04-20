import Game from "./game.class.js";

export let game;

export const startGame = () => {
  game = new Game();
};
