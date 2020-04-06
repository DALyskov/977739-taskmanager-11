import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardAndBoardFiltersTemplate} from './components/board-and-board-filters.js';
import {createTaskEditTemplate} from './components/create-task-edit-template.js';
import {createDefaultTaskTemplate} from './components/default-task.js';
import {createLoadMoreBtnTemplate} from './components/load-more-btn.js';

const TASK_COUNT = 3;
const siteMainElm = document.querySelector(`.main`);
const siteMenuContainerElm = siteMainElm.querySelector(`.main__control`);

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(siteMenuContainerElm, createSiteMenuTemplate());
renderTemplate(siteMainElm, createFilterTemplate());
renderTemplate(siteMainElm, createBoardAndBoardFiltersTemplate());

const boardElm = siteMainElm.querySelector(`.board`);
const boardTasksElm = siteMainElm.querySelector(`.board__tasks`);

renderTemplate(boardTasksElm, createTaskEditTemplate(), `afterbegin`);

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(boardTasksElm, createDefaultTaskTemplate());
}

renderTemplate(boardElm, createLoadMoreBtnTemplate());
