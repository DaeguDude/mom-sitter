import clearPage from './clearPage';
import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import Favorites from './Favorite';
import { getSearchResponse, makeNewUserList } from './getUser';

// const initialState = {
//   searchInput: '',
//   currentTab: 'api',
//   favorites: JSON.parse(localStorage.getItem('users')),
//   userSearchResults: null,
// };

function App() {
  let state = {
    searchInput: '',
    currentTab: 'api',
    favorites: Favorites.getUserData(),
    userSearchResults: null,
  };

  function setState(newState) {
    state = {
      ...newState,
    };
    console.log(state);
    render(state);
  }

  function onSearchChangeHandler(e) {
    setState({
      ...state,
      searchInput: e.target.value,
    });
  }

  function onTabChange(e) {
    if (e.target.classList.contains('tab-local')) {
      return setState({
        ...state,
        currentTab: 'local',
        userSearchResults: null,
        searchInput: '',
      });
    }

    return setState({
      ...state,
      currentTab: 'api',
      searchInput: '',
      userSearchResults: null,
    });
  }

  function onFavoriteHandler(userInfo) {
    const newSearchResult = state.userSearchResults.map((user) => {
      return {
        login: user.login,
        avatar_url: user.avatar_url,
        is_favorite: user.is_favorite,
      };
    });

    const userFound = newSearchResult.find((user) => {
      return user.login === userInfo.login;
    });

    // localStorage에 추가, 삭제
    // searchResult에서 is_favorite 상태 변경
    if (userFound.is_favorite) {
      Favorites.removeUser(userFound.login);
      userFound.is_favorite = !userFound.is_favorite;
    } else {
      userFound.is_favorite = !userFound.is_favorite;
      Favorites.addUser(userFound);
    }

    // local시, 화면에서 지워주세요
    if (state.currentTab === 'local') {
      const indexToRemove = newSearchResult.findIndex((user) => {
        return user.login === userFound.login;
      });
      console.log(indexToRemove);
      newSearchResult.splice(indexToRemove, 1);
    }

    setState({
      ...state,
      userSearchResults: newSearchResult,
      favorites: Favorites.getUserData(),
    });
  }

  async function onSearchHandler(e) {
    if (state.currentTab === 'api') {
      const userToSearch = state.searchInput;
      const response = await getSearchResponse(userToSearch);
      const newUserList = makeNewUserList(response, state.favorites);

      return setState({
        ...state,
        userSearchResults: newUserList,
      });
    }

    if (state.currentTab === 'local') {
      const userToSearch = state.searchInput;
      const newSearchList = state.favorites.filter((user) => {
        const lowerUserToSearch = userToSearch.toLowerCase();
        const lowerUserName = user.login.toLowerCase();
        if (lowerUserName.includes(lowerUserToSearch)) {
          return user;
        }
      });
      return setState({
        ...state,
        userSearchResults: newSearchList,
      });
    }
  }

  function render() {
    const { currentTab, searchInput, userSearchResults } = state;

    clearPage();
    addHeader();
    addNav(
      currentTab,
      searchInput,
      onSearchChangeHandler,
      onTabChange,
      onSearchHandler
    );
    addMain(userSearchResults, onFavoriteHandler);
  }

  return { render };
}

const myApp = App();

export default myApp;
