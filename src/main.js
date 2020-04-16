import {render, RenderPosition} from "./utils.js";
import {SiteMenu as SiteMenuComponent} from './components/site-menu.js';
import {Filter as FilterComponent} from './components/filter.js';
import {BoardAndBoardFilters as BoardAndBoardFiltersComponent} from './components/board-and-board-filters.js';
import {TaskEdit as TaskEditComponent} from './components/task-edit.js';
import {Task as TaskComponent} from './components/default-task.js';
import {LoadMoreBtn as LoadMoreBtnComponent} from './components/load-more-btn.js';
import {generateFilters} from './mock/filter.js';
import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (boardTasksElm, task) => {
  const onEditButtonClick = () => {
    boardTasksElm.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    boardTasksElm.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(boardTasksElm, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const taskListElm = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElm, task);
    });

  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElm, task));

    if (showingTasksCount >= tasks.length) {
      loadMoreBtnComponent.getElement().remove();
      loadMoreBtnComponent.removeElement();
    }
  });
};

const siteMainElm = document.querySelector(`.main`);
const siteMenuContainerElm = siteMainElm.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteMenuContainerElm, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElm, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
const boardComponent = new BoardAndBoardFiltersComponent();
render(siteMainElm, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
