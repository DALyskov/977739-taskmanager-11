import {RenderPosition, render} from './utils/render.js';
import {BoardController} from './controllers/board.js';
import {FilterController} from './controllers/filter.js';
import {SiteMenu as SiteMenuComponent} from './components/site-menu.js';
// import {Filter as FilterComponent} from './components/filter.js';
import {BoardAndBoardFilters as BoardAndBoardFiltersComponent} from './components/board-and-board-filters.js';

import {Tasks as TasksModel} from "./models/tasks.js";

import {generateFilters} from './mock/filter.js';
import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 22;

const siteMainElm = document.querySelector(`.main`);
const siteMenuContainerElm = siteMainElm.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

render(siteMenuContainerElm, new SiteMenuComponent(), RenderPosition.BEFOREEND);

// render(siteMainElm, new FilterComponent(filters), RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElm, tasksModel);
filterController.render(filters);

const boardComponent = new BoardAndBoardFiltersComponent();

render(siteMainElm, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();
