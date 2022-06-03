import {
  buildMessageDate,
  transformTextContent,
} from './utils';

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
    pinEl.innerHTML = '<i class="fa-solid fa-thumbtack"></i>';
    pinEl.href = '#';
    favEl.classList.add('message-favourites', 'message_link-icon');
    favEl.href = '#';
    favEl.innerHTML = '<i class="fa-solid fa-star"></i>';
    dateEl.classList.add('message-date');

    footerEl.append(favEl, pinEl, dateEl);

    let src;
    if (message.type === 'image' || message.type === 'audio' || message.type === 'video') {
      src = `https://chat-diploma.herokuapp.com${message.content.fileName}`;
      const downloadEl = document.createElement('a');
      downloadEl.innerHTML = '<i class="fa-solid fa-download"></i>';
      downloadEl.href = src;
      downloadEl.download = message.content.originalName;
      downloadEl.target = '_blank';
      downloadEl.classList.add('message-download', 'message_link-icon');
      footerEl.insertBefore(downloadEl, dateEl);
    }

    messageEl.append(textEl, footerEl);
    wrapperEl.append(messageEl);

    if (message.author === 'user') {
      wrapperEl.classList.add('user');
    } else {
      wrapperEl.classList.add('bot');
    }

    if (message.type === 'text') {
      textEl.innerHTML = transformTextContent(message.content);
    }

    if (message.type === 'image') {
      textEl.innerHTML = `<img src="${src}" class="message-image" />`;
    }

    if (message.type === 'audio') {
      textEl.innerHTML = `<audio controls src="${src}"></audio>`;
    }

    if (message.type === 'video') {
      textEl.innerHTML = `<video controls width="300" src="${src}"></video>`;
    }

    dateEl.innerHTML = buildMessageDate(message.timestamp);

    const ctx = { message, messageEl: wrapperEl };
    messageCallbacks.forEach((cb) => cb(ctx));

    return wrapperEl;
  };

  const addMessageCallback = (cb) => {
    messageCallbacks.push(cb);
  };

  const findMessageByDataId = (id) => contentEl.querySelector(`[data-id="${id}"]`);

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
    findMessageByDataId,
  };
};

export default createDrawer;
