import { Person } from '../types/Person.js';

// Manages all filtering operations for the game
export class FilterManager {
  private currentPeople: Person[];

  constructor(private allPeople: Person[]) {
    this.currentPeople = [...allPeople]; // Copy all people initially
  }

  // Get the currently filtered people
  getCurrentPeople(): Person[] {
    return this.currentPeople;
  }

  // Reset to show all people
  showAll(): void {
    this.currentPeople = [...this.allPeople];
  }

  // Generic filter function that takes a condition
  private filterPeople(condition: (person: Person) => boolean): void {
    const filtered: Person[] = [];
    for (let i = 0; i < this.currentPeople.length; i++) {
      const person = this.currentPeople[i];
      if (condition(person)) {
        filtered.push(person);
      }
    }
    this.currentPeople = filtered;
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
