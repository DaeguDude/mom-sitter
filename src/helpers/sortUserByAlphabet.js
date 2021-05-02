/**
 * 사용자 리스트를 받아 유저 이름을 비교해 알파벳 순서대로 정렬하여 돌려줌
 *
 * @param {Object[]} userList - 유저 리스트
 * @param {string} userList[].avatar_url - 유저 이미지 주소
 * @param {string} userList[].login - 유저 이름
 * @param {boolean} userList[].is_favorite - 유저 즐겨찾기 등록 여부
 * @returns {Object[]} - 알파벳 순으로 정렬된 사용자 리스트
 */

function sortUserByAlphabet(userList) {
  if (userList === null) {
    return [];
  }

  const newUserList = [...userList];
  newUserList.sort((a, b) => {
    return a.login.localeCompare(b.login);
  });

  return newUserList;
}

export default sortUserByAlphabet;
