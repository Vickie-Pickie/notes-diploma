import * as api from "../api";
import { transformTextContent } from "../utils";

const createPinnedMessage = (drawer, state) => {
  const pinnedEl = document.getElementById('pinned-message');
  const closePinEl = document.querySelector('.pinned-close');

  const drawPinnedMessage = (message) => {
    pinnedEl.classList.remove('hidden');
    const pinnedContent = pinnedEl.querySelector('.pinned-text');
    pinnedContent.innerHTML = transformTextContent(message.content);
  }

  const displayMessagePinIcon = (messageId) => {
    const prevPinMessage = drawer.findMessageByDataId(messageId);
    if (prevPinMessage) {
      prevPinMessage.querySelector('.message-pin').hidden = false;
    }
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

    displayMessagePinIcon(state.pinnedMessage.id);

    state.pinnedMessage = result;
  }

  const pinMessage = async (e, { message, messageEl }) => {
    e.preventDefault();

    let result = await api.pinMessage(message);
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
    drawPinnedMessage
  }
};

export default createPinnedMessage;
