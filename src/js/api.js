export const fetchMessages = async () => {
  try {
    let response = await fetch('https://chat-diploma.herokuapp.com/messages');
    return response.json();
  } catch(error) {
    console.log(error);
  }
};

export const pinMessage = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/pinnedMessage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(message)
  });
  return await response.json();
};

export const sendMessage = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(message),
  });

  return await response.json();
};

export const fetchPinnedMessage = async () => {
  try {
    let response = await fetch('https://chat-diploma.herokuapp.com/pinnedMessage');
    return response.json();
  } catch(error) {
    console.log(error);
  }
};

export const fetchSearchingMessage = async (text) => {
  try {
    let response = await fetch(`https://chat-diploma.herokuapp.com/messages?q=${text}`);
    return response.json();
  } catch(error) {
    console.log(error);
  }
}
