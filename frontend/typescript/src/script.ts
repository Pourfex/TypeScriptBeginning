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
  skinTone: 'light' | 'medium' | 'dark' | 'olive';
  hasEarrings: boolean;
  hasFreckles: boolean;
  lipColor: 'pink' | 'red' | 'natural' | 'purple';
  age: 'young' | 'middle-aged' | 'elderly';
  expression: 'smiling' | 'serious' | 'surprised' | 'sleepy';
}

class GuessWhoGame {
  private people: Person[] = [
    {
      name: "Captain Marina",
      hasHat: true,
      eyeColor: "blue",
      hasHair: true,
      hairColor: "blonde",
      hasGlasses: false,
      hasBeard: false,
      hasMustache: false,
      skinTone: "light",
      hasEarrings: true,
      hasFreckles: true,
      lipColor: "red",
      age: "middle-aged",
      expression: "smiling"
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
      skinTone: "medium",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "natural",
      age: "elderly",
      expression: "serious"
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
      skinTone: "light",
      hasEarrings: true,
      hasFreckles: true,
      lipColor: "purple",
      age: "young",
      expression: "surprised"
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
      skinTone: "olive",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "natural",
      age: "middle-aged",
      expression: "serious"
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
      skinTone: "light",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "natural",
      age: "elderly",
      expression: "smiling"
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
      skinTone: "dark",
      hasEarrings: true,
      hasFreckles: false,
      lipColor: "pink",
      age: "young",
      expression: "smiling"
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
      skinTone: "olive",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "natural",
      age: "middle-aged",
      expression: "smiling"
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
      skinTone: "medium",
      hasEarrings: true,
      hasFreckles: true,
      lipColor: "natural",
      age: "elderly",
      expression: "sleepy"
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
      skinTone: "light",
      hasEarrings: true,
      hasFreckles: true,
      lipColor: "red",
      age: "young",
      expression: "serious"
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
      skinTone: "light",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "natural",
      age: "middle-aged",
      expression: "serious"
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
      skinTone: "light",
      hasEarrings: true,
      hasFreckles: true,
      lipColor: "pink",
      age: "young",
      expression: "surprised"
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
      skinTone: "dark",
      hasEarrings: false,
      hasFreckles: false,
      lipColor: "red",
      age: "middle-aged",
      expression: "smiling"
    }
  ];

  public displayPeople(elementId: string): void {
    const element: HTMLElement | null = document.getElementById(elementId);
    if (!element) return;

    const html = `
      <h2>Guess Who Characters</h2>
      <div class="people-grid">
        ${this.people.map(person => this.createPersonCard(person)).join('')}
      </div>
    `;
    
    element.innerHTML = html;
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
            <span class="label">Skin Tone:</span>
            <span class="value skin-${person.skinTone}">${person.skinTone}</span>
          </div>
          <div class="attribute">
            <span class="label">Earrings:</span>
            <span class="value ${person.hasEarrings ? 'yes' : 'no'}">${person.hasEarrings ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Freckles:</span>
            <span class="value ${person.hasFreckles ? 'yes' : 'no'}">${person.hasFreckles ? 'Yes' : 'No'}</span>
          </div>
          <div class="attribute">
            <span class="label">Lip Color:</span>
            <span class="value lip-${person.lipColor}">${person.lipColor}</span>
          </div>
          <div class="attribute">
            <span class="label">Age:</span>
            <span class="value age-${person.age}">${person.age}</span>
          </div>
          <div class="attribute">
            <span class="label">Expression:</span>
            <span class="value expr-${person.expression}">${person.expression}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
  const game = new GuessWhoGame();
  game.displayPeople('people-container');
});
