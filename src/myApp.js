import clearPage from './clearPage';
import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import getUser from './getUser';

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
    favorites: JSON.parse(localStorage.getItem('users')),
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

  async function onSearchHandler(e) {
    const userToSearch = state.searchInput;
    const userList = await getUser(userToSearch);
    setState({
      ...state,
      userSearchResults: userList,
    });
    // get a user list...
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
    addMain(userSearchResults);
  }

  return { render };
}

const myApp = App();

export default myApp;
