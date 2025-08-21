import { FilterManager } from './FilterManager.js';
import { UIManager } from './UIManager.js';
import { characters } from '../data/characters.js';
import { Person } from '../types/Person.js';

// Main game class that coordinates all the managers
export class Game {
  private filterManager: FilterManager;
  private uiManager: UIManager;

  constructor() {
    this.filterManager = new FilterManager(characters);
    this.uiManager = new UIManager();
  }

  // Initialize and display the game with modern features
  async start(): Promise<void> {
    // Use spread operator to create a copy of characters for initial state
    const initialCharacters = [...characters];
    
    // Destructuring with default values  
    const { length: totalCharacters } = initialCharacters;
    
    console.log(`Starting game with ${totalCharacters} characters`);
    
    // Show all characters initially
    this.showAll();
    
    // Optional: Get game statistics using modern features
    await this.getGameStatistics();
  }

  // Get game statistics using modern array methods and destructuring
  private async getGameStatistics(): Promise<void> {
    const stats = await this.calculateStats([...this.filterManager.getCurrentPeople()]);
    
    // Destructuring the statistics object
    const { 
      totalPeople, 
      demographics,
      ...otherStats 
    } = stats;
    
    console.log('Game Statistics:', {
      totalPeople,
      demographics: { ...demographics }, // Spread operator
      ...otherStats // Spread other statistics
    });
  }

  // Calculate statistics using promises and modern JS features
  private calculateStats(people: Person[]): Promise<{
    totalPeople: number;
    demographics: { [key: string]: number };
    averageFeatures: number;
  }> {
    return new Promise((resolve) => {
      // Using destructuring in reduce operations
      const demographics = people.reduce((acc, { hasHat, hasGlasses, hasBeard }) => {
        return {
          ...acc, // Spread existing accumulator
          hats: acc.hats + (hasHat ? 1 : 0),
          glasses: acc.glasses + (hasGlasses ? 1 : 0),
          beards: acc.beards + (hasBeard ? 1 : 0)
        };
      }, { hats: 0, glasses: 0, beards: 0 });

      // Calculate average features using destructuring
      const featureCounts = Object.values(demographics);
      const averageFeatures = featureCounts.reduce((sum: number, count: number) => sum + count, 0) / featureCounts.length;

      resolve({
        totalPeople: people.length,
        demographics,
        averageFeatures
      });
    });
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
