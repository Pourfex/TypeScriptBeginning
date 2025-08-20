// Main entry point for the Guess Who Game
import { Game } from './managers/Game.js';

// Global variable to access from button clicks
let game: Game;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
  game = new Game();
  game.start();
});