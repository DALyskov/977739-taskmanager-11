import {AbstractComponent} from './abstract-component.js';

const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

const createBoardAndBoardFiltersTemplate = () => {
  return (
    `<section class='board container'>
      <div class='board__filter-list'>
        <a href='#' class='board__filter' data-sort-type='${SortType.DEFAULT}'>SORT BY DEFAULT</a>
        <a href='#' class='board__filter' data-sort-type='${SortType.DATE_UP}'>SORT BY DATE up</a>
        <a href='#' class='board__filter' data-sort-type='${SortType.DATE_DOWN}'>SORT BY DATE down</a>
      </div>
      <div class='board__tasks'></div>
    </section>`
  );
};

class BoardAndBoardFilters extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.DEFAULT;
  }
  getTemplate() {
    return createBoardAndBoardFiltersTemplate();
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().querySelector(`.board__filter-list`)
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}

export {SortType, BoardAndBoardFilters};
