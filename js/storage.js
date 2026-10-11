import { STORAGE_KEY } from './config.js';
import { Running } from './models/running.js';
import { Cycling } from './models/cycling.js';

export function saveWorkouts(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

// JSON only keeps plain data, so turn each saved item back into a
// Running or Cycling object to get its methods back.
function toWorkout(data) {
  // older saves only had one point, called coords
  const route = data.route ?? [data.coords];

  const workout =
    data.type === 'running'
      ? new Running(route, data.distance, data.duration, data.cadence)
      : new Cycling(route, data.distance, data.duration, data.elevationGain);

  workout.id = data.id;
  workout.date = new Date(data.date);
  workout.description = data.description ?? '';
  workout._setTitle();
  return workout;
}

export function loadWorkouts() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return (data ?? []).map(toWorkout);
}
