/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

const validateUrl = (state, form, i18n) => {
  const formData = new FormData(form);
  const url = formData.get('url').trim();
  const existUrls = state.feeds.map((feed) => feed.url);

  const schema = yup.string()
    .url(i18n.t('errors.url'))
    .required(i18n.t('errors.required'))
    .notOneOf(existUrls, 'errors.rssExist');

  return schema.validate(url);
};

const removeCdata = (str) => {
  const regexp1 = /^<!\[CDATA\[/;
  const regexp2 = /]]>$/;

  return str
    .replace(regexp1, '')
    .replace(regexp2, '');
};

const parseRss = ({ rssLink, response }, i18n) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(response, 'application/xml');
  const error = rss.querySelector('parsererror');

  if (error) {
    console.error(error.querySelector('div').textContent);
    throw new Error(i18n.t('errors.invalidRss'));
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

const updateRss = (state, i18n) => {
  if (state.feeds.length < 1) {
    return;
  }

  const promises = state.feeds.map((feed) => loadRss(feed.url));

  Promise.all(promises)
    .then((responses) => {
      const posts = responses
        .flatMap((response) => parseRss(response, i18n).posts);

      const newPosts = _.differenceBy(state.posts, posts, 'url');

      if (newPosts.length > 0) {
        state.newPosts = newPosts;
        state.posts.unshift(...newPosts);
      }
    });
};

const makeTimeout = (delay, state, i18n) => {
  let time = delay;

  const iter = (id = null) => {
    clearTimeout(id);

    const timerId = setTimeout(() => {
      try {
        updateRss(state, i18n);
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

const app = (state, elements, i18n) => {
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    validateUrl(state, elements.form, i18n)
      .then((url) => {
        state.valid = true;
        state.error = null;
        state.processState = 'sending';
        return url;
      })
      .then((url) => loadRss(url))
      .then((content) => {
        const rssData = parseRss(content, i18n);
        state.feeds.unshift(rssData.feed);
        state.posts.unshift(...rssData.posts);
        state.processState = 'finished';
      })
      .catch((err) => {
        state.processState = 'failed';
        if (err.isAxiosError) {
          state.error = i18n.t('errors.network');
        } else {
          // validate message
          state.valid = false;
          state.error = err.message;
        }
      });
  });

  makeTimeout(5000, state, i18n);
};

export default app;
