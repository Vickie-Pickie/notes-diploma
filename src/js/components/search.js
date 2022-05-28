import * as api from "../api";
import {
  COMPONENT_MESSAGES,
  COMPONENT_SEARCH,
} from "../constants";

const createSearch = (drawer, state) => {
  const pinnedEl = document.getElementById('pinned-message');
  const searchIconEl = document.querySelector('.title-search-button');

  const formSearchEl = document.getElementById('search-message-form');
  const inputSearchEl = formSearchEl.elements.search;
  const clearInputEl = document.querySelector('.input-clear');
  const cancelSearchEl = document.querySelector('.cancel-btn');
  const searchBlockEl = document.querySelector('.search-wrapper');

  const searchMessage = async (e) => {
    e.preventDefault();
    pinnedEl.classList.add('hidden');

    if (!inputSearchEl) {
      return;
    }
    const result = await api.fetchSearchingMessage(inputSearchEl.value);

    if (!result.length) {
      drawer.drawNoMessages('Ничего не найдено');
    } else {
      drawer.drawMessageList(result);
    }

    state.component = COMPONENT_SEARCH;
  };

  const clearSearchingResults = () => {
    inputSearchEl.value = '';
    clearInputEl.classList.add('hidden');

    if (state.component === COMPONENT_SEARCH) {
      drawer.drawMessageList(state.messages);
      state.component = COMPONENT_MESSAGES;
    }
  };

  const cleanSearchInput = (e) => {
    e.preventDefault();
    clearSearchingResults();
  };

  const onCancelSearch = (e) => {
    e.preventDefault();
    clearSearchingResults();

    searchBlockEl.classList.add('hidden');
    pinnedEl.classList.remove('hidden');
  };

  const onSearchIconClick = () => {
    if (searchBlockEl.classList.contains('hidden')) {
      searchBlockEl.classList.remove('hidden');
      pinnedEl.classList.add('hidden');
      return;
    }

    searchBlockEl.classList.add('hidden');
    if (state.pinnedMessage.id) {
      pinnedEl.classList.remove('hidden');
    }
  };

  clearInputEl.addEventListener('click', cleanSearchInput);
  formSearchEl.addEventListener('submit', searchMessage);
  cancelSearchEl.addEventListener('click', onCancelSearch);
  searchIconEl.addEventListener('click', onSearchIconClick);
};

export default createSearch;
