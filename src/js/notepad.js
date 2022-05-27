import * as api from "./api";

function transformTextContent(content) {
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  return content.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

const TITLE_MAIN = 'Дневник записей';
const TITLE_FAVOURITES = 'Избранное';

export async function runNotepad() {
  const state = {
    messages: [],
    pinnedMessage: {},
    isSearching: false,
  };

  const formSendEl = document.getElementById('send-message-form');
  const formSearchEl = document.getElementById('search-message-form')
  const inputSendEl = formSendEl.elements.send;
  const inputSearchEl = formSearchEl.elements.search;
  const contentEl = document.getElementById('messages');
  const pinnedEl = document.getElementById('pinned-message');
  const closePinEl = document.querySelector('.pinned-close');
  const clearInputEl = document.querySelector('.input-clear');
  const cancelSearchEl = document.querySelector('.cancel-btn');
  const searchIconEl = document.querySelector('.title-search-button');
  const favouritesIconEl = document.querySelector('.title-favs-button');
  const searchBlockEl = document.querySelector('.search-wrapper');
  const titleEl = document.querySelector('.title-wrapper');


  function drawPinnedMessage(message) {
    pinnedEl.classList.remove('hidden');
    const pinnedContent = pinnedEl.querySelector('.pinned-text');
    pinnedContent.innerHTML = transformTextContent(message.content);
  }

  function drawMessage(message) {
    const wrapperEl = document.createElement('div');
    const messageEl = document.createElement('div');
    const textEl = document.createElement('div');
    const dateEl = document.createElement('div');
    const footerEl = document.createElement('div');
    const pinEl = document.createElement('a');
    const favEl = document.createElement('a');

    wrapperEl.classList.add('message-wrapper');
    wrapperEl.dataset.id = message.id;
    messageEl.classList.add('message');
    textEl.classList.add('message-text');
    footerEl.classList.add('message-footer');
    pinEl.classList.add('message-pin', 'message_link-icon');
    pinEl.innerHTML = `<i class="fa-solid fa-thumbtack"></i>`;
    pinEl.href = '#';
    favEl.classList.add('message-favourites', 'message_link-icon');
    favEl.href = '#';
    favEl.innerHTML = `<i class="fa-solid fa-star"></i>`;
    dateEl.classList.add('message-date');

    footerEl.append(favEl, pinEl, dateEl);
    messageEl.append(textEl, footerEl);
    wrapperEl.append(messageEl);

    if (message.author === 'user') {
      wrapperEl.classList.add('user');
    } else {
      wrapperEl.classList.add('bot');
    }

    if (state.pinnedMessage.id === message.id) {
      pinEl.hidden = true;
    }

    textEl.innerHTML = transformTextContent(message.content);
    const date = new Date (message.timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if ( hours < 10) {
      hours = '0' + hours;
    }

    if ( minutes < 10) {
      minutes = '0' + minutes;
    }
    dateEl.textContent = `${hours}:${minutes}`;

    async function pinMessage(e) {
      e.preventDefault();

      let result = await api.pinMessage(message);
      pinEl.hidden = true;

      const prevPinMessage = contentEl.querySelector(`[data-id="${state.pinnedMessage.id}"]`);

      if (prevPinMessage) {
        prevPinMessage.querySelector('.message-pin').hidden = false;
      }

      state.pinnedMessage = result;
      drawPinnedMessage(result);
    }

    async function addMessageToFavourites(e) {
      e.preventDefault();

      const result = await api.addMessageToFavourites(message);
      favEl.hidden = true;
      state.favourites = result;
    }

    pinEl.addEventListener('click', pinMessage);
    favEl.addEventListener('click', addMessageToFavourites);

    return wrapperEl;
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!inputSendEl.value) {
      return;
    }

    try {
      const message = {
        type: 'text',
        content: inputSendEl.value,
        author: 'user',
        timestamp: Date.now(),
      };
      let result = await api.sendMessage(message);

      inputSendEl.value = '';
      contentEl.append(drawMessage(result));
      contentEl.scrollTop = contentEl.offsetHeight;
    } catch(error) {
      console.log(error);
    }
  }

  async function searchMessage(e) {
    e.preventDefault();
    pinnedEl.classList.add('hidden');
    if (!inputSearchEl) {
      return;
    }
    const result = await api.fetchSearchingMessage(inputSearchEl.value);

    if (!result.length) {
      contentEl.innerHTML = '<div class="no-message-found">Ничего не найдено</div>';
    } else {
      contentEl.innerHTML = '';
      contentEl.append(...result.map((message) => drawMessage(message)));
    }
    state.isSearching = true;
  }

  async function onClosePin() {
    pinnedEl.classList.add('hidden');
    let result = await api.pinMessage({
      type: "",
      content: "",
      author: "",
      timestamp: 0,
      id: 0
    });

    const prevPinMessage = contentEl.querySelector(`[data-id="${state.pinnedMessage.id}"]`);
    if (prevPinMessage) {
      prevPinMessage.querySelector('.message-pin').hidden = false;
    }

    state.pinnedMessage = result;
  }

  function onInputSearch(e) {
    if (e.target.value) {
      clearInputEl.classList.remove('hidden');
    } else {
      clearInputEl.classList.add('hidden');
    }
  }

  function clearSearchingResults() {
    inputSearchEl.value = '';
    clearInputEl.classList.add('hidden');
    if (state.isSearching) {
      contentEl.innerHTML = '';
      contentEl.append(...state.messages.map((message) => drawMessage(message)));
      state.isSearching = false;
    }
  }

  function cleanSearchInput(e) {
    e.preventDefault();
    clearSearchingResults();
  }

  function onCancelSearch(e) {
    e.preventDefault();
    clearSearchingResults();
    searchBlockEl.classList.add('hidden');
    pinnedEl.classList.remove('hidden');
  }

  function onSearchIconClick() {
    if (searchBlockEl.classList.contains('hidden')) {
      searchBlockEl.classList.remove('hidden');
      pinnedEl.classList.add('hidden');
    } else {
      searchBlockEl.classList.add('hidden');
      if (state.pinnedMessage.id) {
        pinnedEl.classList.remove('hidden');
      }
    }
  }

  function onFavouritesIconClick() {
    pinnedEl.hidden = true;
    titleEl.innerHTML = TITLE_FAVOURITES;
    contentEl.innerHTML = '';
    contentEl.append(...state.favourites.map((message) => drawMessage(message)));
    /*нажала на Иконку избранное, в главном окне открылась страничка с избранными сообщениями.
    В заголовке отобразиться Избранное.
    Нажала еще раз - вернуться назад на все сообщения, в заголовке - Все записи
    Если ничего в избранном нет, сообщение Папка Избранное пуста*/
  }

  closePinEl.addEventListener('click', onClosePin);
  inputSearchEl.addEventListener('input', onInputSearch)
  formSendEl.addEventListener("submit", sendMessage);
  clearInputEl.addEventListener('click', cleanSearchInput);
  formSearchEl.addEventListener('submit', searchMessage);
  cancelSearchEl.addEventListener('click', onCancelSearch);
  searchIconEl.addEventListener('click', onSearchIconClick);
  favouritesIconEl.addEventListener('click', onFavouritesIconClick);

  const data = await Promise.all([api.fetchMessages(), api.fetchPinnedMessage()]);
  state.messages = data[0];
  state.pinnedMessage = data[1];

  const messagesEl = state.messages.map((message) => drawMessage(message));
  contentEl.append(...messagesEl);

  if (state.pinnedMessage.id) {
    drawPinnedMessage(state.pinnedMessage);
  }
}
