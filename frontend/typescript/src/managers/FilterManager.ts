import { Person } from '../types/Person.js';

// Manages all filtering operations for the game
export class FilterManager {
  private currentPeople: Person[];

  constructor(private allPeople: Person[]) {
    this.currentPeople = [...allPeople]; // Copy all people initially
    this.runDataValidation(); // Validate data using array methods
  }

  // Validate character data using Array.every, Array.some, and Array.find
  private runDataValidation(): void {
    // Check if ALL characters have valid names using Array.every
    const allHaveNames = this.allPeople.every(person => 
      person.name && person.name.trim().length > 0
    );
    console.log(`All characters have valid names: ${allHaveNames}`);

    // Check if SOME characters have hats using Array.some
    const someHaveHats = this.allPeople.some(person => person.hasHat);
    console.log(`Some characters have hats: ${someHaveHats}`);

    // Find a character with glasses using Array.find
    const personWithGlasses = this.allPeople.find(person => person.hasGlasses);
    if (personWithGlasses) {
      console.log(`Found character with glasses: ${personWithGlasses.name}`);
    }

    // Check if ALL eye colors are valid using Array.every
    const validEyeColors = ['blue', 'brown', 'green', 'hazel', 'gray'];
    const allEyeColorsValid = this.allPeople.every(person => 
      validEyeColors.includes(person.eyeColor)
    );
    console.log(`All eye colors are valid: ${allEyeColorsValid}`);
  }

  // Get the currently filtered people
  getCurrentPeople(): Person[] {
    return this.currentPeople;
  }

  // Reset to show all people
  showAll(): void {
    this.currentPeople = [...this.allPeople];
  }

  // Generic filter function using Array.filter method
  private filterPeople(condition: (person: Person) => boolean): void {
    this.currentPeople = this.currentPeople.filter(condition);
  }

  // Filter by hat
  filterByHat(hasHat: boolean): void {
    this.filterPeople(function(person) {
      return person.hasHat === hasHat;
    });
  }

  // Filter by hair
  filterByHair(hasHair: boolean): void {
    this.filterPeople(function(person) {
      return person.hasHair === hasHair;
    });
  }

  // Filter by glasses
  filterByGlasses(hasGlasses: boolean): void {
    this.filterPeople(function(person) {
      return person.hasGlasses === hasGlasses;
    });
  }

  // Filter by beard
  filterByBeard(hasBeard: boolean): void {
    this.filterPeople(function(person) {
      return person.hasBeard === hasBeard;
    });
  }

  // Filter by mustache
  filterByMustache(hasMustache: boolean): void {
    this.filterPeople(function(person) {
      return person.hasMustache === hasMustache;
    });
  }

  // Filter by earrings
  filterByEarrings(hasEarrings: boolean): void {
    this.filterPeople(function(person) {
      return person.hasEarrings === hasEarrings;
    });
  }

  // Filter by eye color
  filterByEyeColor(eyeColor: string): void {
    this.filterPeople(function(person) {
      return person.eyeColor === eyeColor;
    });
  }

  // Filter by hair color
  filterByHairColor(hairColor: string): void {
    this.filterPeople(function(person) {
      return person.hairColor === hairColor;
    });
  }
}
