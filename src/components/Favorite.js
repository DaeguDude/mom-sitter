import searchDummyData from '../searchDummyData';
import sortUserByAlphabet from '../helpers/sortUserByAlphabet';

function LocalStorage() {
  const getSearchDummyData = () => {
    return searchDummyData;
  };

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
    getSearchDummyData,
    removeUser,
    addUser,
    getUserData,
  };
}

const Favorites = LocalStorage();

export default Favorites;
