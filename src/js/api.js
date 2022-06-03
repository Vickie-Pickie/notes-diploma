export const fetchMessages = async (page, limit) => {
  try {
    const query = new URLSearchParams({
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
    });

    const response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const pinMessage = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/pinnedMessage', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(message),
  });
  const result = await response.json();
  return result;
};

export const addMessageToFavourites = async (message) => {
  message.isFavourite = true;
  const response = await fetch(`https://chat-diploma.herokuapp.com/messages/${message.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(message),
  });
  const result = await response.json();
  return result;
};

export const sendMessage = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(message),
  });

  const result = await response.json();
  return result;
};

export const sendCommand = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/command', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ message }),
  });

  const result = await response.json();
  return result;
};

export const uploadMedia = async (type, formData) => {
  const response = await fetch(`https://chat-diploma.herokuapp.com/upload/${type}`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const fetchPinnedMessage = async () => {
  try {
    const response = await fetch('https://chat-diploma.herokuapp.com/pinnedMessage');
    return response.json();
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const fetchSearchingMessage = async (text) => {
  try {
    const query = new URLSearchParams({
      q: text,
      _sort: 'id',
      _order: 'desc',
    });

    const response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const fetchFavouritesMessages = async (page, limit) => {
  try {
    const query = new URLSearchParams({
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
      isFavourite: 'true',
    });
    const response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const fetchMessagesByType = async (type, page, limit) => {
  try {
    const query = new URLSearchParams({
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
      type,
    });
    const response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }

  return null;
};
