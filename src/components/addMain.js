import createUsersRow from './createUsersRow';

/**
 * 검색된 사용자 리스트를 받아, 화면에 렌더링을 하여줌
 *
 * @param {Object} currentSearchResult - 검색된 사용자 리스트
 * @param {string} currentSearchResult[].avatar_url - 유저 이미지 주소
 * @param {string} currentSearchResult[].login - 유저 이름
 * @param {boolean} currentSearchResult[].is_favorite - 유저 즐겨찾기 등록 여부
 * @param {function} onFavoriteHandler - 즐겨찾기를 추가 삭제 해주는 콜백 함수
 * @returns {}
 */
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

  return userListSection.appendChild(users);
}

if (module.hot) {
  module.hot.accept('./createUser.js', function () {});
}

/**
 * 사용자 리스트를 받아, 사용자 이름의 첫 글자같은 사용자들끼리 그룹으로 묶어 객체를 반환해 줌
 *
 * @param {Object} userList - 검색된 사용자 리스트
 * @param {string} userList[].avatar_url - 유저 이미지 주소
 * @param {string} userList[].login - 유저 이름
 * @param {boolean} userList[].is_favorite - 유저 즐겨찾기 등록 여부
 * @returns
 */
function groupByFirstLetter(userList) {
  return userList.reduce((acc, obj) => {
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
