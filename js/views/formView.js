const form = document.querySelector('.entry-form');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputCadence = document.getElementById('cadence');
const inputElevation = document.getElementById('elevation');
const inputDescription = document.getElementById('description');
const errorEl = document.querySelector('.entry-form__error');

const submitButton = form.querySelector('.entry-form__submit');

// Focus stays on the map, so the user can keep clicking to add points
export function showForm(isEditing = false) {
  showError('');
  submitButton.textContent = isEditing ? 'Save changes' : 'Save';
  form.classList.remove('is-hidden');
}

// Fills the form with a saved workout, for editing
export function fillForm(workout) {
  form.elements.type.value = workout.type;
  showFieldsFor(workout.type);
  inputDuration.value = workout.duration;
  inputCadence.value = workout.cadence ?? '';
  inputElevation.value = workout.elevationGain ?? '';
  inputDescription.value = workout.description;
}

export function setDistance(km) {
  inputDistance.value = `${km.toFixed(2)} km`;
}

export function hideForm() {
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';
  inputDescription.value = '';
  showError('');
  form.classList.add('is-hidden');
}

// Shows a message under the form and marks the field that needs fixing in red
export function showError(message, fieldId) {
  errorEl.textContent = message;
  form.querySelector('[aria-invalid]')?.removeAttribute('aria-invalid');
  if (!fieldId) return;

  const input = document.getElementById(fieldId);
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

export function getFormData() {
  return {
    type: form.elements.type.value,
    duration: +inputDuration.value,
    cadence: +inputCadence.value,
    elevation: +inputElevation.value, // empty counts as 0
    description: inputDescription.value.trim(),
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
  // typing in the red field clears the error
  form.addEventListener('input', function (e) {
    if (e.target.getAttribute('aria-invalid')) showError('');
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    onSubmit();
  });
}
