import { Person } from '../types/Person.js';

// Manages all filtering operations for the game
export class FilterManager {
  private currentPeople: Person[];

  constructor(private allPeople: Person[]) {
    this.currentPeople = [...allPeople]; // Copy all people initially
    this.initializeAsync(); // Initialize with async validation
  }

  // Async initialization with data validation
  private async initializeAsync(): Promise<void> {
    try {
      await this.runDataValidation();
    } catch (error) {
      console.error('Data validation failed:', error);
    }
  }

  // Enhanced data validation using promises, async/await, destructuring, and spread operator
  private async runDataValidation(): Promise<void> {
    // Simulate async validation with Promise
    const validateAsync = (data: Person[]): Promise<Person[]> => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 100); // Simulate async operation
      });
    };

    const validatedPeople = await validateAsync([...this.allPeople]); // Spread operator
    
    // Destructuring assignment for validation results
    const { 
      validNames, 
      hasHats, 
      hasGlasses, 
      validEyeColors,
      statistics 
    } = await this.performValidationChecks(validatedPeople);

    // Log results using destructured values
    console.log('Data Validation Results:', {
      validNames,
      hasHats,
      hasGlasses,
      validEyeColors,
      ...statistics // Spread operator to merge statistics
    });
  }

  // Separate validation logic using destructuring and modern features
  private async performValidationChecks(people: Person[]): Promise<{
    validNames: boolean;
    hasHats: boolean;
    hasGlasses: Person | undefined;
    validEyeColors: boolean;
    statistics: { totalPeople: number; averageHairColors: number };
  }> {
    // Using destructuring in array methods
    const validNames = people.every(({ name }) => name && name.trim().length > 0);
    
    const hasHats = people.some(({ hasHat }) => hasHat);
    
    const hasGlasses = people.find(({ hasGlasses }) => hasGlasses);
    
    // Destructuring with default values
    const allowedEyeColors = ['blue', 'brown', 'green', 'hazel', 'gray'];
    const validEyeColors = people.every(({ eyeColor = 'unknown' }) => 
      allowedEyeColors.includes(eyeColor)
    );

    // Using spread operator and destructuring for statistics
    const hairColors = people
      .map(({ hairColor }) => hairColor)
      .filter(color => color !== null);
    
    const uniqueHairColors = [...new Set(hairColors)]; // Spread operator with Set
    
    const statistics = {
      totalPeople: people.length,
      averageHairColors: uniqueHairColors.length
    };

    return {
      validNames,
      hasHats,
      hasGlasses,
      validEyeColors,
      statistics
    };
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
