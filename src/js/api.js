export const fetchMessages = async (page, limit) => {
  try {
    const query = new URLSearchParams({
      _page: page,
      _limit: limit,
      _sort: 'id',
      _order: 'desc',
    });

    let response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
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

export const addMessageToFavourites = async (message) => {
  const response = await fetch('https://chat-diploma.herokuapp.com/favourites', {
    method: 'POST',
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
    const query = new URLSearchParams({
       q: text,
      _sort: 'id',
      _order: 'desc',
    });
    let response = await fetch(`https://chat-diploma.herokuapp.com/messages?${query.toString()}`);
    return response.json();
  } catch(error) {
    console.log(error);
  }
};

export const fetchFavouritesMessages = async () => {
  try {
    let response = await fetch('https://chat-diploma.herokuapp.com/favourites');
    return response.json();
  } catch(error) {
    console.log(error);
  }
};
