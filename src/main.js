import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardAndBoardFiltersTemplate} from './components/board-and-board-filters.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createDefaultTaskTemplate} from './components/default-task.js';
import {createLoadMoreBtnTemplate} from './components/load-more-btn.js';
import {generateFilters} from './mock/filter.js';
import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElm = document.querySelector(`.main`);
const siteMenuContainerElm = siteMainElm.querySelector(`.main__control`);
const tasks = generateTasks(TASK_COUNT);

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(siteMenuContainerElm, createSiteMenuTemplate());
renderTemplate(siteMainElm, createFilterTemplate(generateFilters()));
renderTemplate(siteMainElm, createBoardAndBoardFiltersTemplate());

const boardElm = siteMainElm.querySelector(`.board`);
const boardTasksElm = siteMainElm.querySelector(`.board__tasks`);

renderTemplate(boardTasksElm, createTaskEditTemplate(tasks[0]), `afterbegin`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount)
.forEach((task) => renderTemplate(boardTasksElm, createDefaultTaskTemplate(task)));

renderTemplate(boardElm, createLoadMoreBtnTemplate());

const loadMoreBtn = boardElm.querySelector(`.load-more`);

loadMoreBtn.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
  .forEach((task) => renderTemplate(boardTasksElm, createDefaultTaskTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreBtn.remove();
  }
});
