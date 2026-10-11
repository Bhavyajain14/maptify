import { STORAGE_KEY } from './config.js';
import { Running } from './models/running.js';
import { Cycling } from './models/cycling.js';

export function saveWorkouts(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

// JSON only keeps plain data, so turn each saved item back into a
// Running or Cycling object to get its methods back.
function toWorkout(data) {
  const workout =
    data.type === 'running'
      ? new Running(data.coords, data.distance, data.duration, data.cadence)
      : new Cycling(data.coords, data.distance, data.duration, data.elevationGain);

  workout.id = data.id;
  workout.date = new Date(data.date);
  workout._setDescription();
  return workout;
}

export function loadWorkouts() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return (data ?? []).map(toWorkout);
}
