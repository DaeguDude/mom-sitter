import searchDummyData from '../searchDummyData';

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
    const newUserData = [...getUserData(), userData];
    storeUserData(newUserData);
  };

  return {
    getSearchDummyData,
    removeUser,
    addUser,
    getUserData,
  };
}

const Favorites = LocalStorage();

export default Favorites;
