import app from './app.js';
import initView from './view.js';

const init = () => {
  const unWatchedState = {
    state: 'filling',
    valid: null,
    errors: [],
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('.rss-form');
  const state = initView(unWatchedState, form);

  app(state, form);
};

export default init;
