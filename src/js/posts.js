const generatePosts = (state, posts, i18n) => {
  const isVisited = (postId) => state.uiState.visitedLinks.includes(postId);

  const modalTitle = document.querySelector('#modal .modal-title');
  const modalDescription = document.querySelector('#modal .modal-body');
  const modalLink = document.querySelector('#modal a.full-article');

  return posts.map((post) => {
    // post { id, feedId, title, description, url }
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const postLink = document.createElement('a');
    postLink.classList.add('fw-bold');
    postLink.setAttribute('href', post.url);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener noreferrer nofollow');
    postLink.dataset.id = post.id;
    postLink.textContent = post.title;
    postLink.addEventListener('click', () => {
      if (!isVisited(post.id)) {
        state.uiState.visitedLinks.push(post.id);
      }
    });

    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.setAttribute('type', 'button');
    postButton.dataset.id = post.id;
    postButton.dataset.bsToggle = 'modal';
    postButton.dataset.bsTarget = '#modal';
    postButton.textContent = i18n.t('buttons.list.open');
    postButton.addEventListener('click', () => {
      modalTitle.textContent = post.title;
      modalDescription.textContent = post.description;
      modalLink.setAttribute('href', post.url);

      if (!isVisited(post.id)) {
        state.uiState.visitedLinks.push(post.id);
      }
    });

    postItem.append(postLink, postButton);
    return postItem;
  });
};

export const prependPosts = (state, { postsContainer }, i18n) => {
  const posts = generatePosts(state, state.newPosts, i18n);
  postsContainer
    .querySelector('ul')
    .prepend(...posts);
};

export const renderPosts = (state, { postsContainer }, i18n) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('titles.posts');

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const items = generatePosts(state, state.posts, i18n);

  postsList.prepend(...items);
  cardBody.append(cardTitle);
  cardWrapper.prepend(cardBody, postsList);
  postsContainer.replaceChildren(cardWrapper);
};
