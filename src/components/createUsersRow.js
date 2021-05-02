import createUser from './createUser';

function createUsersRow(userGroup, onFavoriteHandler) {
  const usersRow = document.createElement('div');
  usersRow.className = 'users__row';

  const usersRowTitle = document.createElement('span');
  usersRowTitle.className = 'users__row-title';
  usersRowTitle.textContent = userGroup[0].login[0].toLowerCase();

  usersRow.appendChild(usersRowTitle);

  userGroup.forEach((userInfo) => {
    const userUI = createUser(userInfo, onFavoriteHandler);
    usersRow.appendChild(userUI);
  });

  return usersRow;
}

export default createUsersRow;
