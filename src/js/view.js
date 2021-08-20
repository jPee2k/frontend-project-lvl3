import onChange from 'on-change';
import renderFeeds from './feeds.js';
import { renderPosts, prependPosts } from './posts.js';

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

const markLinks = ({ postsContainer }, linksIds = []) => {
  linksIds.forEach((id) => {
    postsContainer
      .querySelector(`a[data-id="${parseInt(id, 10)}"]`)
      .classList.replace('fw-bold', 'fw-normal');
  });
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
        renderFeeds(state, elements);
        break;
      case 'posts':
        renderPosts(state, elements);
        break;
      case 'newPosts':
        prependPosts(state, elements);
        break;
      case 'uiState.visitedLinks':
        markLinks(elements, value);
        break;
      default:
        break;
    }
  });

  return state;
};

export default initView;
