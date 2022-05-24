import * as api from "./api";

function transformTextContent(content) {
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  return content.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

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

    wrapperEl.classList.add('message-wrapper');
    wrapperEl.dataset.id = message.id;
    messageEl.classList.add('message');
    textEl.classList.add('message-text');
    footerEl.classList.add('message-footer');
    pinEl.classList.add('message-pin');
    pinEl.textContent = 'Закрепить';
    pinEl.href = '#';
    dateEl.classList.add('message-date');

    footerEl.append(pinEl, dateEl);
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

    pinEl.addEventListener('click', pinMessage);

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
  }

  closePinEl.addEventListener('click', onClosePin);
  inputSearchEl.addEventListener('input', onInputSearch)
  formSendEl.addEventListener("submit", sendMessage);
  clearInputEl.addEventListener('click', cleanSearchInput);
  formSearchEl.addEventListener('submit', searchMessage);
  cancelSearchEl.addEventListener('click', onCancelSearch);

  const data = await Promise.all([api.fetchMessages(), api.fetchPinnedMessage()]);
  state.messages = data[0];
  state.pinnedMessage = data[1];

  const messagesEl = state.messages.map((message) => drawMessage(message));
  contentEl.append(...messagesEl);

  if (state.pinnedMessage.id) {
    drawPinnedMessage(state.pinnedMessage);
  }
}
