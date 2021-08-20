/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

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

const removeCdata = (str) => {
  const regexp1 = /^<!\[CDATA\[/;
  const regexp2 = /]]>$/;

  return str
    .replace(regexp1, '')
    .replace(regexp2, '');
};

const parseRss = ({ rssLink, response }) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(response, 'application/xml');
  const error = rss.querySelector('parsererror');

  if (error) {
    console.error(error.querySelector('div').textContent);
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
    let postDescription = item.querySelector('description').textContent;
    postDescription = removeCdata(postDescription);

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

const updateRss = (state) => {
  if (state.feeds.length < 1) {
    return;
  }

  const promises = state.feeds.map((feed) => loadRss(feed.url));

  Promise.all(promises)
    .then((responses) => {
      const posts = responses
        .flatMap((response) => parseRss(response).posts);

      const newPosts = _.differenceBy(state.posts, posts, 'url');

      if (newPosts.length > 0) {
        state.newPosts = newPosts;
        state.posts.unshift(...newPosts);
      }
    });
};

const makeTimeout = (delay, state) => {
  let time = delay;

  const iter = (id = null) => {
    clearTimeout(id);

    const timerId = setTimeout(() => {
      try {
        updateRss(state);
        time = delay;
      } catch (err) {
        console.error(err);
        time += delay;
      }

      iter(timerId);
    }, time);
  };

  iter();
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

  makeTimeout(5000, state);
};

export default app;
