import { render } from './render';

const initialState = {
  searchInput: '',
  currentTab: 'api',
  favorites: JSON.parse(localStorage.getItem('users')),
  userSearchResults: null,
};

function root() {
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

  return { onTabChange, onSearchChangeHandler };
}

const Root = root();

export { Root, initialState };
