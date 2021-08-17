import onChange from 'on-change';

const renderInput = (elements, isValid) => {
  const validationClassName = isValid ? 'is-valid' : 'is-invalid';

  elements.input.classList.remove('is-valid', 'is-invalid');
  elements.input.classList.add(validationClassName);
};

const renderText = (elements, text, isError = true) => {
  elements.container.classList.remove('text-success', 'text-danger');
  elements.container.textContent = '';

  if (text) {
    elements.container.classList.add('text-success');
    elements.container.textContent = text;
  }
  if (isError) {
    elements.container.classList.add('text-danger');
  }
};

const handleState = (elements, processState) => {
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
      break;
    default:
      throw new Error(`Wrong process state ${processState}!`);
  }
};

const initView = (unWatchedState, elements) => onChange(unWatchedState, (path, value) => {
  switch (path) {
    case 'valid':
      renderInput(elements, value);
      break;
    case 'errors':
      renderText(elements, value[0]);
      break;
    case 'processState':
      handleState(elements, value);
      break;
    default:
      break;
  }
});

export default initView;
