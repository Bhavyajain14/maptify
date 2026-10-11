const btnClear = document.querySelector('.toolbar__btn--clear');

export function addClearHandler(onClear) {
  btnClear.addEventListener('click', onClear);
}
