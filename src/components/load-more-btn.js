import {AbstractComponent} from './abstract-component.js';

const createLoadMoreBtnTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

class LoadMoreBtn extends AbstractComponent {
  getTemplate() {
    return createLoadMoreBtnTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

export {LoadMoreBtn};
