import * as api from "./api";
import createDrawer from "./drawer";
import createFavourites from "./components/favourites";
import createPinnedMessage from "./components/pinnedMessage";
import createSearch from "./components/search";
import createSendMessageForm from "./components/sendMessageForm";
import {
  COMPONENT_AUDIOS,
  COMPONENT_FAVOURITES,
  COMPONENT_IMAGES,
  COMPONENT_MESSAGES, COMPONENT_TEXT, COMPONENT_VIDEOS,
  TITLE_AUDIOS,
  TITLE_IMAGES, TITLE_TEXT, TITLE_VIDEOS
} from "./constants";
import createCategories from "./components/categories";

export async function runNotepad() {
  const state = {
    pinnedMessage: {},
    component: COMPONENT_MESSAGES,
    messages: [],
    page: 1,
    limit: 15,
    isLoading: false,
    isFinishedMessages: false,
    filter: {},
    favourites: {
      messages: [],
      page: 1,
      limit: 15,
      isLoading: false,
      isFinishedMessages: false,
    },
    category: {
      messages: [],
      page: 1,
      limit: 15,
      isLoading: false,
      isFinishedMessages: false,
    },
    search: {
      messages: [],
      page: 1,
      limit: 15,
      isLoading: false,
      isFinishedMessages: false,
    }
  };

  const drawer = createDrawer();
  createSendMessageForm(drawer, state);
  createSearch(drawer, state);
  createFavourites(drawer, state);
  createCategories({
    iconEl: document.querySelector('.title-image-button'),
    component: COMPONENT_IMAGES,
    title: TITLE_IMAGES,
    type: 'image',
  }, drawer, state);
  createCategories({
    iconEl: document.querySelector('.title-audio-button'),
    component: COMPONENT_AUDIOS,
    title: TITLE_AUDIOS,
    type: 'audio',
  }, drawer, state);
  createCategories({
    iconEl: document.querySelector('.title-video-button'),
    component: COMPONENT_VIDEOS,
    title: TITLE_VIDEOS,
    type: 'video',
  }, drawer, state);
  createCategories({
    iconEl: document.querySelector('.title-text-button'),
    component: COMPONENT_TEXT,
    title: TITLE_TEXT,
    type: 'text',
  }, drawer, state);
  const { drawPinnedMessage } = createPinnedMessage(drawer, state);

  const data = await Promise.all([api.fetchMessages(state.page, state.limit), api.fetchPinnedMessage()]);
  state.messages = data[0];
  state.pinnedMessage = data[1];

  drawer.drawMessageList(state.messages);

  if (state.pinnedMessage.id) {
    drawPinnedMessage(state.pinnedMessage);
  }

  const scrollListener = async (e) => {
    const componentState = state.component === COMPONENT_MESSAGES
      ? state
      : state[state.component]
    ;

    if (e.target.scrollTop > 250 || componentState.isLoading || componentState.isFinishedMessages) {
      return;
    }
    componentState.isLoading = true;
    componentState.page += 1;

    let messages;

    if (state.component === COMPONENT_FAVOURITES) {
      messages = await api.fetchFavouritesMessages(componentState.page, componentState.limit);
    } else {
      messages = await api.fetchMessages(componentState.page, componentState.limit);
    }

    if (messages.length < componentState.limit) {
      state.isFinishedMessages = true;
    }
    drawer.prependMessages(messages);
    componentState.messages.push(...messages);
    componentState.isLoading = false;
  };

  drawer.contentEl.addEventListener('scroll', scrollListener);
}
