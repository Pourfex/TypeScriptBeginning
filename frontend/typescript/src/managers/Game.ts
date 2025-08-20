import { FilterManager } from './FilterManager.js';
import { UIManager } from './UIManager.js';
import { characters } from '../data/characters.js';

// Main game class that coordinates all the managers
export class Game {
  private filterManager: FilterManager;
  private uiManager: UIManager;

  constructor() {
    this.filterManager = new FilterManager(characters);
    this.uiManager = new UIManager();
  }

  // Initialize and display the game
  start(): void {
    this.showAll();
  }

  // Show all people - reset filters
  showAll(): void {
    this.filterManager.showAll();
    this.updateDisplay();
  }

  // Update the display with current filtered people
  private updateDisplay(): void {
    const currentPeople = this.filterManager.getCurrentPeople();
    this.uiManager.displayGame('people-container', currentPeople);
  }

  // All the filter methods that delegate to FilterManager
  filterByHat(hasHat: boolean): void {
    this.filterManager.filterByHat(hasHat);
    this.updateDisplay();
  }

  filterByHair(hasHair: boolean): void {
    this.filterManager.filterByHair(hasHair);
    this.updateDisplay();
  }

  filterByGlasses(hasGlasses: boolean): void {
    this.filterManager.filterByGlasses(hasGlasses);
    this.updateDisplay();
  }

  filterByBeard(hasBeard: boolean): void {
    this.filterManager.filterByBeard(hasBeard);
    this.updateDisplay();
  }

  filterByMustache(hasMustache: boolean): void {
    this.filterManager.filterByMustache(hasMustache);
    this.updateDisplay();
  }

  filterByEarrings(hasEarrings: boolean): void {
    this.filterManager.filterByEarrings(hasEarrings);
    this.updateDisplay();
  }

  filterByEyeColor(eyeColor: string): void {
    this.filterManager.filterByEyeColor(eyeColor);
    this.updateDisplay();
  }

  filterByHairColor(hairColor: string): void {
    this.filterManager.filterByHairColor(hairColor);
    this.updateDisplay();
  }
}
