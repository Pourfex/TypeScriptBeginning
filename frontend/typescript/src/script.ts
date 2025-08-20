// Main entry point for the Guess Who Game
import { Game } from './managers/Game.js';

// Declare the global game variable
declare global {
  interface Window {
    game: Game;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
  window.game = new Game();
  window.game.start();
});