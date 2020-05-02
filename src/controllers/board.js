import {RenderPosition, render, remove} from '../utils/render.js';
import {NoTasks as NoTasksComponent} from '../components/no-tasks.js';
import {LoadMoreBtn as LoadMoreBtnComponent} from '../components/load-more-btn.js';
import {SortType} from '../components/board-and-board-filters.js';
import {TaskController} from './task.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;


const renderTasks = (taskListElm, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElm, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
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
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._taskListElm = this._container.getElement().querySelector(`.board__tasks`);

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._container.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(this._taskListElm, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    // const newTasks = renderTasks(this._taskListElm, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    // this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const newTasks = renderTasks(this._taskListElm, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      const tasks = this._tasksModel.getTasks();
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, this._container.getSortType(), prevTasksCount, this._showingTasksCount);
      const newTasks = renderTasks(this._taskListElm, sortedTasks, this._onDataChange, this._onViewChange);

      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    });
  }

  _onDataChange(taskController, oldData, newData) {
    // const index = this._tasks.findIndex((it) => it === oldData);
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    // if (index === -1) {
    //   return;
    // }
    if (isSuccess) {
      taskController.render(newData);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._taskListElm.innerHTML = ``;

    const newTasks = renderTasks(this._taskListElm, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    this._renderLoadMoreButton();
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

}

export {BoardController};
