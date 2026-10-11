import { STORAGE_KEY } from './config.js';

export function saveWorkouts(workouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

export function loadWorkouts() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return data ?? [];
}
