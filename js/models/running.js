import { Workout } from './workout.js';

export class Running extends Workout {
  type = 'running';

  constructor(route, distance, duration, cadence) {
    super(route, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setTitle();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
