import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import '../styles/style.css';
import clearPage from './clearPage';
import Favorites from './Favorite';

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

  const render = () => {
    clearPage();
    addHeader();
    addNav(
      state.currentTab,
      onTabChange,
      state.searchInput,
      onSearchChangeHandler
    );
    addMain();
  };

  return { render };
}

const myApp = App();

export default myApp;
