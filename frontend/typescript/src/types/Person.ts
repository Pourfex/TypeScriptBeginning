// Person interface definition
export interface Person {
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
