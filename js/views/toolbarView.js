const sortSelect = document.querySelector('.toolbar__sort');
const btnFit = document.querySelector('.toolbar__btn--fit');
const btnClear = document.querySelector('.toolbar__btn--clear');

export function addClearHandler(onClear) {
  btnClear.addEventListener('click', onClear);
}

export function addShowAllHandler(onShowAll) {
  btnFit.addEventListener('click', onShowAll);
}

export function addSortHandler(onSort) {
  sortSelect.addEventListener('change', () => onSort(sortSelect.value));
}
