import * as api from '../api';
import { transformTextContent } from '../utils';

const createPinnedMessage = (drawer, state) => {
  const pinnedEl = document.getElementById('pinned-message');
  const closePinEl = document.querySelector('.pinned-close');

  const drawPinnedMessage = (message) => {
    pinnedEl.classList.remove('hidden');
    const pinnedContent = pinnedEl.querySelector('.pinned-text');
    const pinnedPicIcon = pinnedEl.querySelector('.pinned-pic');
    let src;
    if (message.type === 'audio' || message.type === 'video' || message.type === 'image') {
      if (message.type === 'image') {
        pinnedPicIcon.innerHTML = '<i class="fa-solid fa-image fa-2xl"></i>';
      }

      if (message.type === 'audio') {
        pinnedPicIcon.innerHTML = '<i class="fa-solid fa-music fa-2xl"></i>';
      }

      if (message.type === 'video') {
        pinnedPicIcon.innerHTML = '<i class="fa-solid fa-video fa-2xl"></i>';
      }

      src = `https://chat-diploma.herokuapp.com${message.content.fileName}`;
      const mediaLink = document.createElement('a');
      mediaLink.classList.add('pinned-text__link');
      mediaLink.href = src;
      mediaLink.target = '_blank';
      mediaLink.innerHTML = `${message.type}`;
      pinnedContent.replaceChildren(mediaLink);
    } else {
      pinnedPicIcon.innerHTML = '<i class="fa-solid fa-file-lines fa-2xl"></i>';
      pinnedContent.innerHTML = transformTextContent(message.content);
    }
  };

  const displayMessagePinIcon = (messageId) => {
    const prevPinMessage = drawer.findMessageByDataId(messageId);
    if (prevPinMessage) {
      prevPinMessage.querySelector('.message-pin').hidden = false;
    }
  };

  const onClosePin = async () => {
    pinnedEl.classList.add('hidden');
    const result = await api.pinMessage({
      type: '',
      content: '',
      author: '',
      timestamp: 0,
      id: 0,
    });

    displayMessagePinIcon(state.pinnedMessage.id);
    state.pinnedMessage = result;
  };

  const pinMessage = async (e, { message, messageEl }) => {
    e.preventDefault();

    const result = await api.pinMessage(message);
    messageEl.querySelector('.message-pin').hidden = true;

    displayMessagePinIcon(state.pinnedMessage.id);

    state.pinnedMessage = result;
    drawPinnedMessage(result);
  };

  drawer.addMessageCallback((ctx) => {
    const { message, messageEl } = ctx;
    const pinEl = messageEl.querySelector('.message-pin');
    if (state.pinnedMessage.id === message.id) {
      pinEl.hidden = true;
    }

    pinEl.addEventListener('click', (e) => pinMessage(e, ctx));
  });

  closePinEl.addEventListener('click', onClosePin);

  return {
    drawPinnedMessage,
  };
};

export default createPinnedMessage;
