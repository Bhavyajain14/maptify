const form = document.querySelector('.entry-form');
const inputType = document.getElementById('type');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputCadence = document.getElementById('cadence');
const inputElevation = document.getElementById('elevation');
const errorEl = document.querySelector('.entry-form__error');

export function showForm() {
  showError('');
  form.classList.remove('is-hidden');
  inputDistance.focus();
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
    type: inputType.value,
    distance: +inputDistance.value,
    duration: +inputDuration.value,
    cadence: +inputCadence.value,
    elevation: +inputElevation.value,
  };
}

function toggleElevationField() {
  inputElevation.closest('.field').classList.toggle('field--hidden');
  inputCadence.closest('.field').classList.toggle('field--hidden');
}

export function addFormHandlers(onSubmit) {
  inputType.addEventListener('change', toggleElevationField);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    onSubmit();
  });
}
