import * as yup from 'yup';

const validateUrl = (state, form) => {
  const formData = new FormData(form);
  const url = formData.get('url');
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .required('Это поле обязательно к заполнению')
    .notOneOf(state.feeds, 'RSS уже существует');

  return schema.validate(url);
};

const app = (state, elements) => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    validateUrl(state, elements.form)
      .then((data) => {
        state.valid = true;
        state.errors = [];
        state.feeds.push(data);
        state.processState = 'sending';
      })
      .catch((err) => {
        state.valid = false;
        state.errors = err.errors;
      });
    // then get xml from axios request
    // then parse
  });

  // const parser = new DOMParser();
  // const doc = parser.parseFromString(xml, 'application/xml');
};

export default app;
