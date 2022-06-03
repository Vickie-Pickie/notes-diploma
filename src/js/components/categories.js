import * as api from '../api';
import {
  COMPONENT_MESSAGES,
  TITLE_MAIN,
} from '../constants';

const createCategories = (ctx, drawer, state) => {
  const {
    iconEl,
    component,
    title,
    type,
  } = ctx;
  const titleEl = document.querySelector('.title-wrapper');

  const onIconClick = async () => {
    if (state.component === component) {
      titleEl.innerHTML = TITLE_MAIN;
      state.component = COMPONENT_MESSAGES;

      drawer.drawMessageList(state.messages);
      return;
    }

    titleEl.innerHTML = title;
    state.component = component;
    state.category.page = 1;
    state.category.isFinishedMessages = false;
    state.category.messages = await api.fetchMessagesByType(
      type,
      state.category.page,
      state.category.limit,
    );

    if (!state.category.messages.length) {
      drawer.drawNoMessages('Нет записей');
    } else {
      drawer.drawMessageList(state.category.messages);
    }
  };

  iconEl.addEventListener('click', onIconClick);
};

export default createCategories;
