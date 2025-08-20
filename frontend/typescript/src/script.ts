// TypeScript Guess Who Game
interface Person {
  name: string;
  hasHat: boolean;
  eyeColor: 'blue' | 'brown' | 'green' | 'hazel' | 'gray';
  hasHair: boolean;
  hairColor: 'blonde' | 'brown' | 'black' | 'red' | 'gray' | 'white' | null;
  hasGlasses: boolean;
  hasBeard: boolean;
  hasMustache: boolean;
  hasEarrings: boolean;
}

class GuessWhoGame {
  private allPeople: Person[] = [
    {
      name: "Captain Marina",
      hasHat: true,
      eyeColor: "blue",
      hasHair: true,
      hairColor: "blonde",
      hasGlasses: false,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Professor Blackwood",
      hasHat: false,
      eyeColor: "brown",
      hasHair: true,
      hairColor: "black",
      hasGlasses: true,
      hasBeard: true,
      hasMustache: true,
      hasEarrings: false
    },
    {
      name: "Sunny the Artist",
      hasHat: true,
      eyeColor: "green",
      hasHair: true,
      hairColor: "red",
      hasGlasses: true,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Detective Rodriguez",
      hasHat: false,
      eyeColor: "hazel",
      hasHair: true,
      hairColor: "brown",
      hasGlasses: false,
      hasBeard: false,
      hasMustache: true,
      hasEarrings: false
    },
    {
      name: "Grandpa Winston",
      hasHat: true,
      eyeColor: "gray",
      hasHair: true,
      hairColor: "white",
      hasGlasses: true,
      hasBeard: true,
      hasMustache: true,
      hasEarrings: false
    },
    {
      name: "Luna the Dancer",
      hasHat: false,
      eyeColor: "blue",
      hasHair: true,
      hairColor: "black",
      hasGlasses: false,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Chef Giuseppe",
      hasHat: true,
      eyeColor: "brown",
      hasHair: false,
      hairColor: null,
      hasGlasses: false,
      hasBeard: false,
      hasMustache: true,
      hasEarrings: false
    },
    {
      name: "Mystic Sage",
      hasHat: false,
      eyeColor: "green",
      hasHair: true,
      hairColor: "gray",
      hasGlasses: true,
      hasBeard: true,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Rebel Zara",
      hasHat: false,
      eyeColor: "hazel",
      hasHair: true,
      hairColor: "red",
      hasGlasses: true,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Admiral Storm",
      hasHat: true,
      eyeColor: "blue",
      hasHair: true,
      hairColor: "blonde",
      hasGlasses: false,
      hasBeard: true,
      hasMustache: true,
      hasEarrings: false
    },
    {
      name: "Pixie Moonbeam",
      hasHat: false,
      eyeColor: "green",
      hasHair: true,
      hairColor: "blonde",
      hasGlasses: false,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: true
    },
    {
      name: "Doctor Vega",
      hasHat: false,
      eyeColor: "brown",
      hasHair: true,
      hairColor: "black",
      hasGlasses: true,
      hasBeard: false,
      hasMustache: false,
      hasEarrings: false
    }
  ];
  private currentPeople: Person[] = [];

  public displayPeople(elementId: string): void {
    const element: HTMLElement | null = document.getElementById(elementId);
    if (!element) return;

    const html = `
      <h2>Guess Who Characters</h2>
      <div class="filter-buttons">
        <button onclick="game.showAll()">Show All</button>
        <button onclick="game.filterByHat(true)">Has Hat</button>
        <button onclick="game.filterByHat(false)">No Hat</button>
        <button onclick="game.filterByHair(true)">Has Hair</button>
        <button onclick="game.filterByHair(false)">No Hair</button>
        <button onclick="game.filterByGlasses(true)">Has Glasses</button>
        <button onclick="game.filterByGlasses(false)">No Glasses</button>
        <button onclick="game.filterByBeard(true)">Has Beard</button>
        <button onclick="game.filterByBeard(false)">No Beard</button>
        <button onclick="game.filterByMustache(true)">Has Mustache</button>
        <button onclick="game.filterByMustache(false)">No Mustache</button>
        <button onclick="game.filterByEarrings(true)">Has Earrings</button>
        <button onclick="game.filterByEarrings(false)">No Earrings</button>
        <button onclick="game.filterByEyeColor('blue')">Blue Eyes</button>
        <button onclick="game.filterByEyeColor('brown')">Brown Eyes</button>
        <button onclick="game.filterByEyeColor('green')">Green Eyes</button>
        <button onclick="game.filterByEyeColor('hazel')">Hazel Eyes</button>
        <button onclick="game.filterByEyeColor('gray')">Gray Eyes</button>
        <button onclick="game.filterByHairColor('blonde')">Blonde Hair</button>
        <button onclick="game.filterByHairColor('brown')">Brown Hair</button>
        <button onclick="game.filterByHairColor('black')">Black Hair</button>
        <button onclick="game.filterByHairColor('red')">Red Hair</button>
        <button onclick="game.filterByHairColor('gray')">Gray Hair</button>
        <button onclick="game.filterByHairColor('white')">White Hair</button>
      </div>
      <div class="people-grid">
        ${this.createAllPersonCards()}
      </div>
    `;
    
    element.innerHTML = html;
  }

  // Create HTML for all person cards using simple for loop
  private createAllPersonCards(): string {
    // Check if no people match the filters
    if (this.currentPeople.length === 0) {
      return '<div class="no-results">No people match the current filters. Click "Show All" to reset.</div>';
    }

    // Start with empty string
    let allCardsHTML = '';
    
    // Loop through each person and add their card HTML
    for (let i = 0; i < this.currentPeople.length; i++) {
      const person = this.currentPeople[i];
      const personCardHTML = this.createPersonCard(person);
      allCardsHTML = allCardsHTML + personCardHTML;
    }
    
    // Return the combined HTML
    return allCardsHTML;
  }

  private createPersonCard(person: Person): string {
    return `
      <div class="person-card">
        <h3>${person.name}</h3>
        <div class="attributes">
          <div class="attribute">
            <span class="label">Hat:</span>
            <span class="value ${person.hasHat ? 'yes' : 'no'}">${person.hasHat ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Eye Color:</span>
            <span class="value eye-${person.eyeColor}">${person.eyeColor}</span>
          </div>
          <div class="attribute">
            <span class="label">Hair:</span>
            <span class="value ${person.hasHair ? 'yes' : 'no'}">${person.hasHair ? 'Yes' : 'No'}</span>
          </div>
          ${person.hasHair ? `
          <div class="attribute">
            <span class="label">Hair Color:</span>
            <span class="value hair-${person.hairColor}">${person.hairColor}</span>
          </div>
          ` : ''}
          <div class="attribute">
            <span class="label">Glasses:</span>
            <span class="value ${person.hasGlasses ? 'yes' : 'no'}">${person.hasGlasses ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Beard:</span>
            <span class="value ${person.hasBeard ? 'yes' : 'no'}">${person.hasBeard ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Mustache:</span>
            <span class="value ${person.hasMustache ? 'yes' : 'no'}">${person.hasMustache ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Earrings:</span>
            <span class="value ${person.hasEarrings ? 'yes' : 'no'}">${person.hasEarrings ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Show all people - reset filter
  public showAll(): void {
    this.currentPeople = this.allPeople;
    this.displayPeople('people-container');
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
    this.displayPeople('people-container');
  }

  // Filter by hat
  public filterByHat(hasHat: boolean): void {
    this.filterPeople(function(person) {
      return person.hasHat === hasHat;
    });
  }

  // Filter by hair
  public filterByHair(hasHair: boolean): void {
    this.filterPeople(function(person) {
      return person.hasHair === hasHair;
    });
  }

  // Filter by glasses
  public filterByGlasses(hasGlasses: boolean): void {
    this.filterPeople(function(person) {
      return person.hasGlasses === hasGlasses;
    });
  }

  // Filter by beard
  public filterByBeard(hasBeard: boolean): void {
    this.filterPeople(function(person) {
      return person.hasBeard === hasBeard;
    });
  }

  // Filter by mustache
  public filterByMustache(hasMustache: boolean): void {
    this.filterPeople(function(person) {
      return person.hasMustache === hasMustache;
    });
  }

  // Filter by earrings
  public filterByEarrings(hasEarrings: boolean): void {
    this.filterPeople(function(person) {
      return person.hasEarrings === hasEarrings;
    });
  }

  // Filter by eye color
  public filterByEyeColor(eyeColor: string): void {
    this.filterPeople(function(person) {
      return person.eyeColor === eyeColor;
    });
  }

  // Filter by hair color
  public filterByHairColor(hairColor: string): void {
    this.filterPeople(function(person) {
      return person.hairColor === hairColor;
    });
  } 
}

// Global variable to access from button clicks
let game: GuessWhoGame;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
  game = new GuessWhoGame();
  game.showAll(); // Initialize with all people
});
