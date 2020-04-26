import {AbstractComponent} from './abstract-component.js';

const createFilterMarkup = (name, count) => {
  return (
    `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span>
    </label>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((v) => createFilterMarkup(v.name, v.count)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

export {Filter};
