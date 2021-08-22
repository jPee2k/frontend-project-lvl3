const generateFeeds = (feeds) => feeds.map((feed) => {
  // feed { id, url, title, description }
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedTitle = document.createElement('h3');
  feedTitle.classList.add('m-0', 'h6');
  feedTitle.textContent = feed.title;

  const feedText = document.createElement('p');
  feedText.classList.add('m-0', 'small', 'text-black-50');
  feedText.textContent = feed.description;

  feedItem.append(feedTitle, feedText);

  return feedItem;
});

const renderFeeds = ({ feeds }, { feedsContainer }, i18n) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('titles.feeds');

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  const items = generateFeeds(feeds);

  feedsList.prepend(...items);
  cardBody.append(cardTitle);
  cardWrapper.prepend(cardBody, feedsList);
  feedsContainer.replaceChildren(cardWrapper);
};

export default renderFeeds;
