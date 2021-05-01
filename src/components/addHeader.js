import createFragment from '../helpers/cretateFragment';

function addHeader() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = createFragment(`
    <header class="userlist-section__header container">
      <h1 class="userlist-section__title">Github Stars</h1>
    </header>
  `);

  return userListSection.appendChild(UI);
}

export default addHeader;
