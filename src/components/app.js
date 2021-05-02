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

  function setState(newState, shouldRender = true) {
    state = {
      ...newState,
    };

    if (shouldRender) {
      console.log(state);
      return render(state);
    }
  }

  function onSearchChangeHandler(e) {
    setState(
      {
        ...state,
        searchInput: e.target.value,
      },
      false
    );
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
    e.preventDefault();
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

    if (userFound.is_favorite) {
      Favorites.removeUser(userFound.login);
      userFound.is_favorite = !userFound.is_favorite;
    } else {
      userFound.is_favorite = !userFound.is_favorite;
      Favorites.addUser(userFound);
    }

    if (state.currentTab === 'local') {
      const indexToRemove = newSearchResult.findIndex((user) => {
        return user.login === userFound.login;
      });
      newSearchResult.splice(indexToRemove, 1);
    }

    setState({
      ...state,
      userSearchResults: newSearchResult,
      favorites: Favorites.getUserData(),
    });
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
    addMain(userSearchResults, onFavoriteHandler);
  };

  return { render };
}

const myApp = App();

// if (module.hot) {
//   module.hot.accept('./addHeader.js', function () {
//     const userlistSection = document.querySelector('.userlist-section');
//     const oldHeader = document.querySelector('.userlist-section__header');
//     const newHeader = addHeader();

//     console.log('what');
//     userlistSection.replaceChild(newHeader, oldHeader);
//   });
// }

if (module.hot) {
  module.hot.accept('./addNav.js', function () {
    console.log('ADDNAV: changed');
    console.log('------------------------');
  });
}

export default myApp;
