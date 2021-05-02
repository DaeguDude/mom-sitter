import sortUserByAlphabet from '../helpers/sortUserByAlphabet';

/**
 * localStorage를 이용하여 즐겨찾기에 사용자 리스트를 추가, 삭제해 줄 수 있는 함수를 돌려줌
 *
 * @returns {Object} - 즐겨찾기 추가, 삭제 등을 할 수 있는 함수들을 담은 객체
 */

function LocalStorage() {
  const storeUserData = (userData) => {
    localStorage.setItem('users', JSON.stringify(userData));
  };

  const getUserData = () => {
    const favoriteUsers = JSON.parse(localStorage.getItem('users'));
    return sortUserByAlphabet(favoriteUsers);
  };

  const removeUser = (userName) => {
    const newUserData = getUserData().filter((user) => user.login !== userName);
    storeUserData(newUserData);
  };

  const addUser = (userData) => {
    const newUserData = [...getUserData(), userData];
    storeUserData(newUserData);
  };

  return {
    removeUser,
    addUser,
    getUserData,
  };
}

const Favorites = LocalStorage();

export default Favorites;
