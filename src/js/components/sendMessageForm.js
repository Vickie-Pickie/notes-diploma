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
      try {
        let result = await api.sendCommand(inputSendEl.value);
        console.log(result);
        inputSendEl.value = '';
        result.forEach((message) => drawer.appendMessage(message));
        state.messages.unshift(...result);
      } catch(error) {
        console.log(error);
      }
   } else {
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
    }
  };

  const attachFile = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      let result = await api.uploadMedia(type, formData);

      drawer.appendMessage(result);
      state.messages.unshift(result);
    } catch(error) {
      console.log(error);
    }
  };

  const attachImage = (e) => {
    attachFile('image', e.target.files[0]);
  };

  const attachAudio = async (e) => {
    attachFile('audio', e.target.files[0]);
  };

  const attachVideo = async (e) => {
    attachFile('video', e.target.files[0]);
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) {
      return;
    }

    files.forEach(async (file) => {
      const typeParts = file.type.split('/');
      if (['audio', 'image', 'video'].indexOf(typeParts[0]) === -1) {
        return;
      }
      attachFile(typeParts[0], file);
    });
  };

  formSendEl.addEventListener("submit", sendMessage);
  inputImageEl.addEventListener('change', attachImage);
  inputAudioEl.addEventListener('change', attachAudio);
  inputVideoEl.addEventListener('change', attachVideo);
  drawer.contentEl.addEventListener('drop', handleDropFile);
  drawer.contentEl.addEventListener('dragover', (e) => e.preventDefault());
};

export default createSendMessageForm;
