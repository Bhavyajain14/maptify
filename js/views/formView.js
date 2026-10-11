const form = document.querySelector('.entry-form');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputCadence = document.getElementById('cadence');
const inputElevation = document.getElementById('elevation');
const errorEl = document.querySelector('.entry-form__error');

// Focus stays on the map, so the user can keep clicking to add points
export function showForm() {
  showError('');
  form.classList.remove('is-hidden');
}

export function setDistance(km) {
  inputDistance.value = `${km.toFixed(2)} km`;
}

export function hideForm() {
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';
  showError('');
  form.classList.add('is-hidden');
}

export function showError(message) {
  errorEl.textContent = message;
}

export function getFormData() {
  return {
    type: form.elements.type.value,
    duration: +inputDuration.value,
    cadence: +inputCadence.value,
    elevation: +inputElevation.value,
  };
}

// Running needs cadence, cycling needs elevation gain
function showFieldsFor(type) {
  inputCadence.closest('.field').classList.toggle('field--hidden', type !== 'running');
  inputElevation.closest('.field').classList.toggle('field--hidden', type !== 'cycling');
}

export function addFormHandlers(onSubmit, onUndo, onCancel) {
  form.querySelector('.entry-form__undo').addEventListener('click', onUndo);
  form.querySelector('.entry-form__cancel').addEventListener('click', onCancel);

  form.addEventListener('change', function (e) {
    if (e.target.name === 'type') showFieldsFor(e.target.value);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    onSubmit();
  });
}
