import { TYPE_LABELS } from '../config.js';
import { escapeHtml, formatDateTime } from '../helpers.js';

const containerWorkouts = document.querySelector('.log');

function detail(icon, value, unit) {
  return `
    <div class="stat">
      <span class="stat__icon">${icon}</span>
      <span class="stat__value">${value}</span>
      <span class="stat__unit">${unit}</span>
    </div>`;
}

function workoutHtml(workout) {
  const isRunning = workout.type === 'running';

  return `
    <li class="log-item log-item--${workout.type}" data-id="${workout.id}">
      <div class="log-item__meta">
        <span class="tag tag--${workout.type}">${TYPE_LABELS[workout.type]}</span>
        <time datetime="${workout.date.toISOString()}">${formatDateTime(workout.date)}</time>
        ${workout.editedAt ? '<span>· edited</span>' : ''}
      </div>
      ${
        workout.description
          ? `<h2 class="log-item__title">${escapeHtml(workout.description)}</h2>`
          : ''
      }
      <div class="log-item__actions">
        <button type="button" class="log-item__edit" aria-label="Edit workout">Edit</button>
        <button type="button" class="log-item__delete" aria-label="Delete workout">&times;</button>
      </div>
      ${detail(isRunning ? '🏃‍♂️' : '🚴‍♀️', workout.distance, 'km')}
      ${detail('⏱', workout.duration, 'min')}
      ${
        isRunning
          ? detail('⚡️', workout.pace.toFixed(1), 'min/km') +
            detail('🦶🏼', workout.cadence, 'spm')
          : detail('⚡️', workout.speed.toFixed(1), 'km/h') +
            detail('⛰', workout.elevationGain, 'm')
      }
    </li>`;
}

// Replaces the whole list, keeping the order of the array
export function renderList(workouts) {
  containerWorkouts.innerHTML = workouts.map(workoutHtml).join('');
}

export function addListClickHandler(
  onWorkoutClick,
  onEditClick,
  onDeleteClick,
) {
  containerWorkouts.addEventListener('click', function (e) {
    const workoutEl = e.target.closest('.log-item');
    if (!workoutEl) return;

    const id = workoutEl.dataset.id;

    if (e.target.closest('.log-item__delete')) onDeleteClick(id);
    else if (e.target.closest('.log-item__edit')) onEditClick(id);
    else onWorkoutClick(id);
  });
}
