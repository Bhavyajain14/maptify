const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');

function detail(icon, value, unit) {
  return `
    <div class="workout__details">
      <span class="workout__icon">${icon}</span>
      <span class="workout__value">${value}</span>
      <span class="workout__unit">${unit}</span>
    </div>`;
}

function workoutHtml(workout) {
  const isRunning = workout.type === 'running';

  return `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <button class="workout__delete" title="Delete workout">&times;</button>
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
  clearList();
  form.insertAdjacentHTML('afterend', workouts.map(workoutHtml).join(''));
}

export function removeWorkout(id) {
  containerWorkouts.querySelector(`[data-id="${id}"]`)?.remove();
}

export function clearList() {
  containerWorkouts.querySelectorAll('.workout').forEach(el => el.remove());
}

export function addListClickHandler(onWorkoutClick, onDeleteClick) {
  containerWorkouts.addEventListener('click', function (e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    if (e.target.closest('.workout__delete')) onDeleteClick(workoutEl.dataset.id);
    else onWorkoutClick(workoutEl.dataset.id);
  });
}
