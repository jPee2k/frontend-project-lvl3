import app from './app.js';
import initView from './view.js';

const init = () => {
  const unWatchedState = {
    processState: 'filling',
    valid: true,
    error: null,
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[aria-label="add"]'),
    textContainer: document.querySelector('p.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };
  const state = initView(unWatchedState, elements);

  app(state, elements);
};

export default init;
