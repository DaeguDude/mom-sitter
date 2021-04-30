function addHeader() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = document.createRange().createContextualFragment(`
    <header class="userlist-section__header container">
      <h1 class="userlist-section__title">Github Stars</h1>
      <button>log users in favorite</button>
      <button>clear favorite storage</button>
    </header>
  `);

  return userListSection.appendChild(UI);
}

export default addHeader;
