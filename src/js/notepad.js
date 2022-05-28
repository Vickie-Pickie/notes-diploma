import * as api from "./api";
import createDrawer from "./drawer";
import createFavourites from "./components/favourites";
import createPinnedMessage from "./components/pinnedMessage";
import createSearch from "./components/search";
import createSendMessageForm from "./components/sendMessageForm";
import {COMPONENT_MESSAGES} from "./constants";

export async function runNotepad() {
  const state = {
    messages: [],
    pinnedMessage: {},
    favourites: [],
    component: COMPONENT_MESSAGES,
    page: 1,
    limit: 15,
    isLoading: false,
    isFinishedMessages: false,
  };

  const drawer = createDrawer();
  createSendMessageForm(drawer, state);
  createSearch(drawer, state);
  createFavourites(drawer, state);
  const { drawPinnedMessage } = createPinnedMessage(drawer, state);

  const data = await Promise.all([api.fetchMessages(state.page, state.limit), api.fetchPinnedMessage(), api.fetchFavouritesMessages()]);
  state.messages = data[0];
  state.pinnedMessage = data[1];
  state.favourites = data[2];

  drawer.drawMessageList(state.messages);

  if (state.pinnedMessage.id) {
    drawPinnedMessage(state.pinnedMessage);
  }

  drawer.contentEl.addEventListener('scroll', async (e) => {
    if (e.target.scrollTop > 250 || state.isLoading || state.isFinishedMessages) {
      return;
    }
    state.isLoading = true;
    state.page += 1;
    const messages = await api.fetchMessages(state.page, state.limit);
    if (messages.length < state.limit) {
      state.isFinishedMessages = true;
    }
    drawer.prependMessages(messages);
    state.messages.push(...messages);
    state.isLoading = false;
  });
}
