// prettier-ignore
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class Workout {
  date = new Date();
  id = crypto.randomUUID();

  constructor(route, distance, duration) {
    this.route = route; // list of [lat, lng] points
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    const type = this.type[0].toUpperCase() + this.type.slice(1);
    this.description = `${type} on ${MONTHS[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}
