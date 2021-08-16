import * as yup from 'yup';

const validateUrl = (state, url) => {
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .required('Это поле обязательно к заполнению')
    .notOneOf(state.feeds, 'RSS уже существует');

  schema.validate(url)
    .then(() => {
      state.valid = true;
      state.errors = [];
    })
    .catch((err) => {
      state.valid = false;
      state.errors = err.errors;
    });
};

const app = (state, form) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const url = formData.get('url');

    validateUrl(state, url);
  });

  // const parser = new DOMParser();
  // const doc = parser.parseFromString(xml, 'application/xml');
};

export default app;
