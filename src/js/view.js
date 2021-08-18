import onChange from 'on-change';

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
      elements.form.reset();
      elements.input.focus();
      break;
    case 'finished':
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
        // render feed block
        // elements.feedsContainer
        break;
      case 'posts':
        // render posts block
        // elements.postsContainer
        break;
      default:
        break;
    }
  });

  return state;
};

export default initView;
