import i18next from 'i18next';
import app from './app.js';
import initView from './view.js';
import resources from '../locales/index.js';

const init = () => {
  const defaultLang = 'ru';
  const unWatchedState = {
    lang: defaultLang,
    processState: 'filling',
    uiState: {
      visitedLinks: [],
    },
    valid: true,
    error: null,
    feeds: [],
    posts: [],
    newPosts: [],
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[aria-label="add"]'),
    textContainer: document.querySelector('p.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };
  const state = initView(unWatchedState, elements, i18n);

  app(state, elements, i18n);
};

export default init;
