import onChange from 'on-change';
import renderPosts from './posts.template.js';
import renderFeeds from './feeds.template.js';

const renderInput = (elements, isValid) => {
  const validationClassName = isValid ? 'is-valid' : 'is-invalid';

  elements.input.classList.remove('is-valid', 'is-invalid');
  elements.input.classList.add(validationClassName);
};

const renderText = (elements, text, isError = true) => {
  elements.textContainer.classList.remove('text-success', 'text-danger');
  elements.textContainer.textContent = '';

  if (text) {
    elements.textContainer.classList.add('text-success');
    elements.textContainer.textContent = text;
  }
  if (isError) {
    elements.textContainer.classList.add('text-danger');
  }
};

const handleState = (state, elements, processState) => {
  switch (processState) {
    case 'filling':
      elements.button.disabled = false;
      break;
    case 'sending':
      elements.button.disabled = true;
      break;
    case 'finished':
      elements.form.reset();
      elements.input.focus();
      elements.button.disabled = false;
      renderText(elements, 'RSS успешно загружен', false);
      break;
    case 'failed':
      elements.button.disabled = false;
      renderText(elements, state.error);
      break;
    default:
      throw new Error(`Wrong process state ${processState}!`);
  }
};

const initView = (unWatchedState, elements) => {
  const state = onChange(unWatchedState, (path, value) => {
    switch (path) {
      case 'processState':
        handleState(state, elements, value);
        break;
      case 'valid':
        renderInput(elements, value);
        break;
      case 'error':
        renderText(elements, value);
        break;
      case 'feeds':
        // refactor -> render wrapper -> append & render only new feed
        renderFeeds(state, elements);
        break;
      case 'posts':
        // refactor -> render wrapper -> append & render only new posts
        renderPosts(state, elements);
        break;
      default:
        break;
    }
  });

  return state;
};

export default initView;
