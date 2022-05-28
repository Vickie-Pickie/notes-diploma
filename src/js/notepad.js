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
  };

  const drawer = createDrawer();
  createSendMessageForm(drawer, state);
  createSearch(drawer, state);
  createFavourites(drawer, state);
  const { drawPinnedMessage } = createPinnedMessage(drawer, state);

  const data = await Promise.all([api.fetchMessages(), api.fetchPinnedMessage(), api.fetchFavouritesMessages()]);
  state.messages = data[0];
  state.pinnedMessage = data[1];
  state.favourites = data[2];

  drawer.drawMessageList(state.messages);

  if (state.pinnedMessage.id) {
    drawPinnedMessage(state.pinnedMessage);
  }
}
