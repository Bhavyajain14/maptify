export class Workout {
  date = new Date();
  id = crypto.randomUUID();
  description = ''; // optional, written by the user, shown as the heading
  editedAt = null; // set when the workout is changed after saving

  constructor(route, distance, duration) {
    this.route = route; // list of [lat, lng] points
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}
