import createFragment from './createFragment';
import createUserUI from './user';

function addMain(currentSearchResult, onFavoriteHandler) {
  console.log({ currentSearchResult });
  const userListSection = document.querySelector('.userlist-section');

  const users = document.createElement('main');
  users.className = 'users';

  const usersRow = document.createElement('div');
  usersRow.className = 'users__row';

  const usersRowTitle = document.createElement('span');
  usersRowTitle.className = 'users__row-title';
  usersRowTitle.innerText = 'a';

  users.appendChild(usersRow);
  usersRow.appendChild(usersRowTitle);

  if (currentSearchResult !== null) {
    currentSearchResult.forEach((userInfo) => {
      const userUI = createUserUI(userInfo, onFavoriteHandler);
      usersRow.appendChild(userUI);
    });
  }

  return userListSection.appendChild(users);
}

export default addMain;
