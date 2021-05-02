import createFragment from '../helpers/cretateFragment';

/**
 * Header 부분을 렌더링 하여줌
 *
 * @returns {}
 */
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
