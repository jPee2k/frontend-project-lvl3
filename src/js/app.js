import * as yup from 'yup';
import axios from 'axios';

const validateUrl = (state, form) => {
  const formData = new FormData(form);
  const url = formData.get('url');
  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .required('Это поле обязательно к заполнению')
    .notOneOf(state.feeds, 'RSS уже существует');

  return schema.validate(url);
};

const parseRss = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

const downloadFeed = (url) => {
  const api = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  api.searchParams.set('url', url);
  api.searchParams.set('disableCache', 'true');
  const apiUrl = api.toString();

  axios.get(apiUrl)
    .then((response) => {
      console.log(response);
    });
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
        return data;
      })
      .then((url) => downloadFeed(url))
      .catch((err) => {
        state.valid = false;
        state.errors = err.errors;
      });
  });
};

export default app;
