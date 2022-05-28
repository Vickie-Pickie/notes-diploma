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

  const onFavouritesIconClick = async () => {
    if (state.component === COMPONENT_FAVOURITES) {
      titleEl.innerHTML = TITLE_MAIN;
      state.component = COMPONENT_MESSAGES;

      drawer.drawMessageList(state.messages);
      return;
    }

    titleEl.innerHTML = TITLE_FAVOURITES;
    state.component = COMPONENT_FAVOURITES;
    state.favourites.page = 1;
    state.favourites.isFinishedMessages = false;
    state.favourites.messages = await api.fetchFavouritesMessages(state.favourites.page, state.favourites.limit);

    if (!state.favourites.messages.length) {
      drawer.drawNoMessages('Папка Избранное пуста');
    }

    drawer.drawMessageList(state.favourites.messages);
  };

  const addMessageToFavourites = async (e, { message, messageEl }) => {
    e.preventDefault();

    await api.addMessageToFavourites(message);
    messageEl.querySelector('.message-favourites').hidden = true;
  };

  drawer.addMessageCallback((ctx) => {
    const { message, messageEl } = ctx;
    const favEl = messageEl.querySelector('.message-favourites');
    if (message.isFavourite) {
      favEl.hidden = true;
    }

    favEl.addEventListener('click', (e) => addMessageToFavourites(e, ctx));
  });

  favouritesIconEl.addEventListener('click', onFavouritesIconClick);
};

export default createFavourites;
