const renderPosts = ({ posts }, { postsContainer }) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Посты';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const items = posts.map((post) => {
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

    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.setAttribute('type', 'button');
    postButton.dataset.id = post.id;
    postButton.dataset.bsToggle = 'modal';
    postButton.dataset.bsTarget = '#modal';
    postButton.textContent = 'Просмотр';

    postItem.append(postLink, postButton);

    return postItem;
  });

  postsList.prepend(...items);
  cardBody.append(cardTitle);
  cardWrapper.prepend(cardBody, postsList);
  postsContainer.replaceChildren(cardWrapper);
};

export default renderPosts;
