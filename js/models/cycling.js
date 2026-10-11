import { Workout } from './workout.js';

export class Cycling extends Workout {
  type = 'cycling';

  constructor(route, distance, duration, elevationGain) {
    super(route, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setTitle();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
