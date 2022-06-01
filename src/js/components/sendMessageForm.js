import * as api from "../api";
import {COMMANDS} from "../constants";
import {extractCommandName} from "../utils";

const createSendMessageForm = (drawer, state) => {
  const formSendEl = document.getElementById('send-form');
  const inputSendEl = formSendEl.elements.message;
  const inputImageEl = formSendEl.elements.image;
  const inputAudioEl = formSendEl.elements.audio;
  const inputVideoEl = formSendEl.elements.video;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputSendEl.value) {
      return;
    }

    const commandName = extractCommandName(inputSendEl.value);
    if (COMMANDS.indexOf(commandName) !== -1) {

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

  const attachImage = async (e) => {
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      let result = await api.uploadMedia('image', formData);

      drawer.appendMessage(result);
      state.messages.unshift(result);
    } catch(error) {
      console.log(error);
    }
  };

  const attachAudio = async (e) => {
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      let result = await api.uploadMedia('audio', formData);

      drawer.appendMessage(result);
      state.messages.unshift(result);
    } catch(error) {
      console.log(error);
    }
  };

  const attachVideo = async (e) => {
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      let result = await api.uploadMedia('video', formData);

      drawer.appendMessage(result);
      state.messages.unshift(result);
    } catch(error) {
      console.log(error);
    }
  };

  formSendEl.addEventListener("submit", sendMessage);
  inputImageEl.addEventListener('change', attachImage);
  inputAudioEl.addEventListener('change', attachAudio);
  inputVideoEl.addEventListener('change', attachVideo);
};

export default createSendMessageForm;
