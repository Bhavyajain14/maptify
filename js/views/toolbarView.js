const btnFit = document.querySelector('.toolbar__btn--fit');
const btnClear = document.querySelector('.toolbar__btn--clear');

export function addClearHandler(onClear) {
  btnClear.addEventListener('click', onClear);
}

export function addShowAllHandler(onShowAll) {
  btnFit.addEventListener('click', onShowAll);
}
