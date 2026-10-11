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

export function renderWorkout(workout) {
  const isRunning = workout.type === 'running';

  const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
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

  // newest workout goes right below the form
  form.insertAdjacentHTML('afterend', html);
}

export function addListClickHandler(onWorkoutClick) {
  containerWorkouts.addEventListener('click', function (e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    onWorkoutClick(workoutEl.dataset.id);
  });
}
