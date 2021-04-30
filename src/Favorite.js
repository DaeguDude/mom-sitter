import searchDummyData from './searchDummyData';

function LocalStorage() {
  const getSearchDummyData = () => {
    return searchDummyData;
  };

  const storeUserData = (userData) => {
    localStorage.setItem('users', JSON.stringify(userData));
  };

  const getUserData = () => {
    return JSON.parse(localStorage.getItem('users'));
  };

  const removeUser = (userName) => {
    const newUserData = getUserData().filter((user) => user.login !== userName);
    storeUserData(newUserData);
  };

  const addUser = (userData) => {
    let newUserData = [];

    if (isStorageEmpty()) {
      newUserData.push(userData);
    } else {
      newUserData = [...getUserData(), userData];
    }

    storeUserData(newUserData);
  };

  const doesExist = (userName) => {
    if (getUserData() === null) {
      return false;
    }

    const result = getUserData().find(
      (userInfo) => userInfo.login === userName
    );

    return result ? true : false;
  };

  const isStorageEmpty = () => {
    return localStorage.getItem('users') === null ? true : false;
  };

  return {
    getSearchDummyData,
    removeUser,
    addUser,
    getUserData,
    doesExist,
  };
}

const Favorites = LocalStorage();

export default Favorites;
