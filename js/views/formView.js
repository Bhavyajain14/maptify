const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

export function showForm() {
  form.classList.remove('hidden');
  inputDistance.focus();
}

export function hideForm() {
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';

  // hide straight away, without the slide animation
  form.style.display = 'none';
  form.classList.add('hidden');
  setTimeout(() => (form.style.display = 'grid'), 1000);
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
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
}

export function addFormHandlers(onSubmit) {
  inputType.addEventListener('change', toggleElevationField);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    onSubmit();
  });
}
