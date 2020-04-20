import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {TaskEdit as TaskEditComponent} from '../components/task-edit.js';
import {Task as TaskComponent} from '../components/default-task.js';
import {NoTasks as NoTasksComponent} from '../components/no-tasks.js';
import {LoadMoreBtn as LoadMoreBtnComponent} from '../components/load-more-btn.js';
import {SortType} from '../components/board-and-board-filters.js';

const SHOWING_TASKS_COUNT_ON_START = 2;
const SHOWING_TASKS_COUNT_BY_BUTTON = 2;

const renderTask = (boardTasksElm, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(taskComponent, taskEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onEditButtonClick = () => {
    replace(taskEditComponent, taskComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    replace(taskComponent, taskEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler(onEditFormSubmit);

  render(boardTasksElm, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElm, tasks) => {
  tasks.forEach((task) => renderTask(taskListElm, task));
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
  }

  render(tasks) {
    const boardComponent = this._container.getElement();
    const taskListElm = boardComponent.querySelector(`.board__tasks`);
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      renderTasks(taskListElm, tasks.slice(prevTasksCount, showingTasksCount));

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });

    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    };

    if (isAllTasksArchived) {
      render(taskListElm, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElm, tasks.slice(0, showingTasksCount));

    renderLoadMoreButton();

    this._container.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);

      taskListElm.innerHTML = ``;

      renderTasks(taskListElm, sortedTasks);

      renderLoadMoreButton();
    });
  }
}

export {BoardController};
