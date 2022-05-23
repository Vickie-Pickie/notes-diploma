export function drawMessage(message) {
  function pinMessage(e) {
    e.preventDefault();
    pinEl.hidden = true;
  }
  const wrapperEl = document.createElement('div');
  const messageEl = document.createElement('div');
  const textEl = document.createElement('div');
  const dateEl = document.createElement('div');
  const footerEl = document.createElement('div');
  const pinEl = document.createElement('a');

  wrapperEl.classList.add('message-wrapper');
  messageEl.classList.add('message');
  textEl.classList.add('message-text');
  footerEl.classList.add('message-footer');
  pinEl.classList.add('message-pin');
  pinEl.textContent = 'Закрепить';
  pinEl.href = '#';
  pinEl.addEventListener('click', pinMessage);
  dateEl.classList.add('message-date');

  footerEl.append(pinEl, dateEl);
  messageEl.append(textEl, footerEl);
  wrapperEl.append(messageEl);

  if (message.author === 'user') {
    wrapperEl.classList.add('user');
  } else {
    wrapperEl.classList.add('bot');
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

  return wrapperEl;
}

function transformTextContent(content) {
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  return content.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

export async function fetchMessages() {
  try {
    let response = await fetch('https://chat-diploma.herokuapp.com/messages');
    console.log(response);
    return response.json();
  } catch(error) {
    console.log(error);
  }
}

export async function runNotepad() {
  const formEl = document.getElementById('send-message');
  const input = formEl.elements.content;
  const contentEl = document.getElementById('messages');

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.value) {
      return;
    }

    try {
      const message = {
        type: 'text',
        content: input.value,
        author: 'user',
        timestamp: Date.now(),
      };

      let response = await fetch('https://chat-diploma.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(message),
      });

      let result = await response.json();
      input.value = '';
      contentEl.append(drawMessage(result));
      contentEl.scrollTop = contentEl.offsetHeight;
    } catch(error) {
      console.log(error);
    }
  }

  formEl.addEventListener("submit", sendMessage);

  const messages = await fetchMessages();
  const messagesEl = messages.map( (message) => drawMessage(message));

  contentEl.append(...messagesEl);
}
