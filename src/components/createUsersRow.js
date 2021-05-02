import createUser from './createUser';

/**
 * 이름의 첫 글자로 묶인 유저 그룹과, 즐겨찾기 추가 삭제 함수를 받아 동적으로 작동하는
 * documentFragment를 만들어 줌
 *
 * @param {Object[]} userGroup - 사용자 이름 첫 글자로 묶인 유저 그룹
 * @param {function} onFavoriteHandler - 즐겨찾기를 추가 삭제 해주는 콜백 함수
 * @returns {documentFragment} - 사용자 리스트를 보여주는 UI
 */
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
