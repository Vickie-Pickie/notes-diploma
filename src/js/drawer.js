import {buildMessageDate, transformTextContent} from "./utils";

const createDrawer = () => {
  const contentEl = document.getElementById('messages');
  const messageCallbacks = [];

  const drawMessage = (message) => {
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

    textEl.innerHTML = transformTextContent(message.content);
    dateEl.textContent = buildMessageDate(message.timestamp);

    const ctx = { message, messageEl: wrapperEl };
    messageCallbacks.forEach((cb) => cb(ctx));

    return wrapperEl;
  };

  const addMessageCallback = (cb) => {
    messageCallbacks.push(cb);
  };

  const findMessageByDataId = (id) => {
    return contentEl.querySelector(`[data-id="${id}"]`);
  };

  const prependMessages = (messages) => {
    messages.map((message) => drawMessage(message)).forEach((el) => contentEl.prepend(el));
  };

  const drawMessageList = (messages) => {
    contentEl.innerHTML = '';
    messages.map((message) => drawMessage(message)).forEach((el) => contentEl.prepend(el));
    contentEl.scrollTop = contentEl.scrollHeight;
  };

  const drawNoMessages = (text) => {
    contentEl.innerHTML = `<div class="no-message-found">${text}</div>`;
  };

  const appendMessage = (message) => {
    contentEl.append(drawMessage(message));
    contentEl.scrollTop = contentEl.scrollHeight;
  };

  return {
    contentEl,
    prependMessages,
    addMessageCallback,
    appendMessage,
    drawMessage,
    drawMessageList,
    drawNoMessages,
    findMessageByDataId
  }
};

export default createDrawer;
