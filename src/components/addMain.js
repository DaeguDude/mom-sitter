import createUsersRow from './createUsersRow';

let newCurrentSearchResult;
let newOnFavoriteHandler;

function addMain(currentSearchResult, onFavoriteHandler) {
  const userListSection = document.querySelector('.userlist-section');

  const users = document.createElement('main');
  users.className = 'users';

  if (currentSearchResult !== null) {
    const userGroups = groupByFirstLetter(currentSearchResult);
    for (const firstLetter in userGroups) {
      const usersRow = createUsersRow(
        userGroups[firstLetter],
        onFavoriteHandler
      );
      users.appendChild(usersRow);
    }
  }

  // DEVELOPMENT
  newCurrentSearchResult = currentSearchResult;
  newOnFavoriteHandler = onFavoriteHandler;

  return userListSection.appendChild(users);
}

if (module.hot) {
  module.hot.accept('./createUser.js', function () {});
}

function groupByFirstLetter(objectArray) {
  return objectArray.reduce((acc, obj) => {
    // obj.name의 첫번째 글자가 키로 존재하는지 확인
    const firstLetter = obj.login[0].toLowerCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }

    acc[firstLetter].push(obj);
    return acc;
  }, {});
}

export default addMain;
