import onChange from 'on-change';

const renderInput = (form, isValid) => {
  const urlInput = form.querySelector('#url-input');
  const validationClassName = isValid ? 'is-valid' : 'is-invalid';

  urlInput.classList.remove('is-valid', 'is-invalid');
  urlInput.classList.add(validationClassName);
};

const renderError = (form, errors) => {
  const errorContainer = form.parentElement.querySelector('p.feedback');
  errorContainer.classList.remove('text-success');
  errorContainer.textContent = '';

  if (errors) {
    const [error] = errors;
    errorContainer.classList.add('text-success');
    errorContainer.textContent = error;
  }
};

const initView = (unWatchedState, form) => {
  const state = onChange(unWatchedState, (path, value) => {
    switch (path) {
      case 'valid':
        renderInput(form, value);
        break;
      case 'errors':
        renderError(form, value);
        break;
      default:
        break;
    }
  });

  return state;
};

export default initView;
