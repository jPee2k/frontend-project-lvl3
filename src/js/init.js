import app from './app.js';
import initView from './view.js';

const init = () => {
  const unWatchedState = {
    processState: 'filling',
    valid: null,
    errors: [],
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[aria-label="add"]'),
    container: document.querySelector('p.feedback'),
  };
  const state = initView(unWatchedState, elements);

  app(state, elements);
};

export default init;
