import { Person } from '../types/Person.js';

// Manages all UI display operations
export class UIManager {
  
  // Create HTML for all person cards using simple for loop

  // Create HTML for all person cards using Array.map
  createAllPersonCards(people: Person[]): string {
    // Check if no people match the filters
    if (people.length === 0) {
      return '<div class="no-results">No people match the current filters. Click "Show All" to reset.</div>';
    }

    // Use Array.map to transform each person into HTML, then join
    return people
      .map(person => this.createPersonCard(person))
      .join('');
  }

  // Create HTML for a single person card
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

  // Create the filter buttons HTML
  createFilterButtons(): string {
    return `
      <div class="filter-buttons">
        <button onclick="window.game.showAll()">Show All</button>
        <button onclick="window.game.filterByHat(true)">Has Hat</button>
        <button onclick="window.game.filterByHat(false)">No Hat</button>
        <button onclick="window.game.filterByHair(true)">Has Hair</button>
        <button onclick="window.game.filterByHair(false)">No Hair</button>
        <button onclick="window.game.filterByGlasses(true)">Has Glasses</button>
        <button onclick="window.game.filterByGlasses(false)">No Glasses</button>
        <button onclick="window.game.filterByBeard(true)">Has Beard</button>
        <button onclick="window.game.filterByBeard(false)">No Beard</button>
        <button onclick="window.game.filterByMustache(true)">Has Mustache</button>
        <button onclick="window.game.filterByMustache(false)">No Mustache</button>
        <button onclick="window.game.filterByEarrings(true)">Has Earrings</button>
        <button onclick="window.game.filterByEarrings(false)">No Earrings</button>
        <button onclick="window.game.filterByEyeColor('blue')">Blue Eyes</button>
        <button onclick="window.game.filterByEyeColor('brown')">Brown Eyes</button>
        <button onclick="window.game.filterByEyeColor('green')">Green Eyes</button>
        <button onclick="window.game.filterByEyeColor('hazel')">Hazel Eyes</button>
        <button onclick="window.game.filterByEyeColor('gray')">Gray Eyes</button>
        <button onclick="window.game.filterByHairColor('blonde')">Blonde Hair</button>
        <button onclick="window.game.filterByHairColor('brown')">Brown Hair</button>
        <button onclick="window.game.filterByHairColor('black')">Black Hair</button>
        <button onclick="window.game.filterByHairColor('red')">Red Hair</button>
        <button onclick="window.game.filterByHairColor('gray')">Gray Hair</button>
        <button onclick="window.game.filterByHairColor('white')">White Hair</button>
      </div>
    `;
  }

  // Display the main game interface
  displayGame(elementId: string, people: Person[]): void {
    const element: HTMLElement | null = document.getElementById(elementId);
    if (!element) return;

    const html = `
      <h2>Guess Who Characters</h2>
      ${this.createFilterButtons()}
      <div class="people-grid">
        ${this.createAllPersonCards(people)}
      </div>
    `;
    
    element.innerHTML = html;
  }
}
