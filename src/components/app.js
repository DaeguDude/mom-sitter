import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import '../styles/style.css';
import clearPage from './clearPage';
import Favorites from './Favorite';
import getUserList from '../helpers/getUserList';

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

    return render(state);
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

  async function onSearchHandler(e) {
    const { currentTab, searchInput, favorites } = state;

    if (state.currentTab === 'api') {
      const userToSearch = searchInput;
      const newUserList = await getUserList(userToSearch, favorites);

      return setState({
        ...state,
        userSearchResults: newUserList,
      });
    }

    if (currentTab === 'local') {
      const userToSearch = searchInput;
      const newSearchList = favorites.filter((user) => {
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

  const render = () => {
    const { currentTab, searchInput, userSearchResults } = state;

    clearPage();
    addHeader();
    addNav(
      currentTab,
      onTabChange,
      searchInput,
      onSearchChangeHandler,
      onSearchHandler
    );
    addMain(userSearchResults);
  };

  return { render };
}

const myApp = App();

export default myApp;
