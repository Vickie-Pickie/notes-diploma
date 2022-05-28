import * as api from "../api";
import {
  COMPONENT_FAVOURITES,
  COMPONENT_MESSAGES,
  TITLE_FAVOURITES,
  TITLE_MAIN,
} from "../constants";

const createFavourites = (drawer, state) => {
  const favouritesIconEl = document.querySelector('.title-favs-button');
  const titleEl = document.querySelector('.title-wrapper');

  const onFavouritesIconClick = () => {
    if (state.component === COMPONENT_FAVOURITES) {
      titleEl.innerHTML = TITLE_MAIN;
      state.component = COMPONENT_MESSAGES;

      drawer.drawMessageList(state.messages);
      return;
    }

    titleEl.innerHTML = TITLE_FAVOURITES;
    state.component = COMPONENT_FAVOURITES;
    if (!state.favourites.length) {
      drawer.drawNoMessages('Папка Избранное пуста');
    }

    drawer.drawMessageList(state.favourites);
  };

  const addMessageToFavourites = async (e, { message, messageEl }) => {
    e.preventDefault();

    const result = await api.addMessageToFavourites(message);
    messageEl.querySelector('.message-favourites').hidden = true;
    state.favourites.push(result);
  };

  drawer.addMessageCallback((ctx) => {
    const { message, messageEl } = ctx;
    const favEl = messageEl.querySelector('.message-favourites');
    if (state.favourites.findIndex((item) => item.id === message.id) !== -1) {
      favEl.hidden = true;
    }

    favEl.addEventListener('click', (e) => addMessageToFavourites(e, ctx));
  });

  favouritesIconEl.addEventListener('click', onFavouritesIconClick);
};

export default createFavourites;
