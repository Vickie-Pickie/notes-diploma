import * as api from "../api";

const createSendMessageForm = (drawer, state) => {
  const formSendEl = document.getElementById('send-form');
  const inputSendEl = formSendEl.elements.message;

  const sendMessage = async (e) => {
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
      drawer.appendMessage(result);
      state.messages.unshift(result);
    } catch(error) {
      console.log(error);
    }
  };

  formSendEl.addEventListener("submit", sendMessage);
};

export default createSendMessageForm;
