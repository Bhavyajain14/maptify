const sortSelect = document.querySelector('.controls__select');
const btnFit = document.querySelector('.controls__button--fit');
const btnClear = document.querySelector('.controls__button--clear');

export function addClearHandler(onClear) {
  btnClear.addEventListener('click', onClear);
}

export function addShowAllHandler(onShowAll) {
  btnFit.addEventListener('click', onShowAll);
}

export function addSortHandler(onSort) {
  sortSelect.addEventListener('change', () => onSort(sortSelect.value));
}
