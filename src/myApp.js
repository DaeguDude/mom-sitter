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
      });
    }

    return setState({
      ...state,
      currentTab: 'api',
    });
  }

  function onFavoriteHandler(userInfo) {
    console.log('onFavoriteHandler');
    // 이놈 Favorite에 있어?

    console.log(userInfo);
  }

  async function onSearchHandler(e) {
    const userToSearch = state.searchInput;
    const response = await getSearchResponse(userToSearch);
    const newUserList = makeNewUserList(response, state.favorites);
    setState({
      ...state,
      userSearchResults: newUserList,
    });
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
