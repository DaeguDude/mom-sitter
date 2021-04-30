import createFragment from './createFragment';

function addHeader() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = createFragment(`
    <header class="userlist-section__header container">
      <h1 class="userlist-section__title">Github Stars</h1>
      <button class="logStorage">log users in favorite</button>
      <button class="clearStorage">clear favorite storage</button>
    </header>
  `);

  // log, clear storage
  UI.querySelector('.logStorage').addEventListener('click', () => {
    console.log(JSON.parse(localStorage.getItem('users')));
  });
  UI.querySelector('.clearStorage').addEventListener('click', () => {
    localStorage.clear();
  });

  return userListSection.appendChild(UI);
}

export default addHeader;
