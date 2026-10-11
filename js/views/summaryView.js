import { formatMinutes } from '../helpers.js';

const summaryEl = document.querySelector('.summary');

export function renderSummary(workouts) {
  if (!workouts.length) {
    summaryEl.textContent = '';
    return;
  }

  const km = workouts.reduce((sum, work) => sum + work.distance, 0);
  const minutes = workouts.reduce((sum, work) => sum + work.duration, 0);
  const label = workouts.length === 1 ? 'workout' : 'workouts';

  summaryEl.textContent = `${workouts.length} ${label} · ${km.toFixed(1)} km · ${formatMinutes(minutes)}`;
}
