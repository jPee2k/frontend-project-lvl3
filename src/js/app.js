import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

const validateUrl = (state, form) => {
  const formData = new FormData(form);
  const url = formData.get('url').trim();
  const existUrls = state.feeds.map((feed) => feed.url);

  const schema = yup.string()
    .url('Ссылка должна быть валидным URL')
    .required('Это поле обязательно к заполнению')
    .notOneOf(existUrls, 'RSS уже существует');

  return schema.validate(url);
};

const parseRss = ({ rssLink, response }) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(response, 'application/xml');

  if (rss.querySelector('parsererror')) {
    throw new Error('Ресурс не содержит валидный RSS');
  }

  const feedId = _.uniqueId();

  const title = rss.querySelector('title');
  const description = rss.querySelector('description');
  const items = rss.querySelectorAll('item');

  const feed = {
    id: feedId, url: rssLink, title: title.textContent, description: description.textContent,
  };
  const posts = [...items].map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;

    return {
      id: _.uniqueId(), feedId, title: postTitle, description: postDescription, url: postLink,
    };
  });

  return { feed, posts };
};

const loadRss = (rssLink) => {
  const api = 'https://hexlet-allorigins.herokuapp.com';
  const url = new URL('/get', api);
  url.searchParams.set('url', rssLink);
  url.searchParams.set('disableCache', 'true');

  return axios
    .get(url.toString())
    .then((response) => ({ rssLink, response: response.data.contents }));
};

const app = (state, elements) => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    validateUrl(state, elements.form)
      .then((url) => {
        state.valid = true;
        state.error = null;
        state.processState = 'sending';
        return url;
      })
      .then((url) => loadRss(url))
      .then((content) => {
        const rssData = parseRss(content);
        state.feeds.unshift(rssData.feed);
        state.posts.unshift(...rssData.posts);
        state.processState = 'finished';
      })
      .catch((err) => {
        state.processState = 'failed';

        if (err.isAxiosError) {
          state.error = 'Ой... что-то пошло не так';
        } else {
          // validate message
          state.valid = false;
          state.error = err.message;
        }
      });
  });
};

export default app;
