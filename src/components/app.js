import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import '../styles/style.css';
import clearPage from './clearPage';
import Favorites from './Favorite';
import getUserList from '../helpers/getUserList';

/**
 * 앱의 모든 상태를 관리하는 진리의 원천(Single source of truth).
 * render 함수를 통해 다른 컴포넌트들에게 현재 앱 상태를 전달하여 주어 화면에 렌더링을 해 줌
 *
 * @returns {Object} - 화면에 현재 앱의 상태를 렌더링 해주는 render 콜백 함수를 반환
 */
function App() {
  let state = {
    searchInput: '',
    currentTab: 'api',
    favorites: Favorites.getUserData(),
    userSearchResults: null,
  };

  /**
   * 앱의 상태를 바꾸어 주고 화면에 렌더링을 시작함(하지 않는 경우도 있음)
   *
   * @param {Object} newState - 새로운 앱 상태
   * @param {boolean} shouldRender - render를 할 지 말지 결정해 줌
   * @returns
   */
  function setState(newState, shouldRender = true) {
    state = {
      ...newState,
    };

    if (shouldRender) {
      return render(state);
    }
  }

  /**
   * searchInput의 상태를 관리하여 줌
   *
   * @param {Object} e - 발생한 이벤트
   * @returns {}
   */
  function onSearchChangeHandler(e) {
    return setState(
      {
        ...state,
        searchInput: e.target.value,
      },
      false
    );
  }

  /**
   * 현재 탭 상태를 지정하여 줌
   *
   * @param {Object} e - 발생한 이벤트
   * @returns {}
   */
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

  /**
   * 유저를 검색하여 검색된 사용자를 userSearchResults에 저장시켜 줌
   *
   * @param {Object} e - 발생한 이벤트
   * @returns {}
   */
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

  /**
   * 유저 정보를 받아, 즐겨찾기에 등록되어 있는지 유무 확인 후 추가 혹은 삭제 해줌
   *
   * @param {Object} userInfo - 유저 정보
   * @param {string} userInfo.avatar_url - 유저 이미지 주소
   * @param {string} userInfo.login - 유저 이름
   * @param {boolean} userInfo.is_favorite - 유저 즐겨찾기 등록 여부
   */
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

  /**
   * 현재 앱의 상태를 불러와 화면에 렌더링을 해 줌. 이것이 동작하는 방식은 모든 노드를 지우고, 현재 앱
   * 상태를 기반으로 새로운 노드들을 만들어 렌더링을 하여준다.(현재 아주 무겁고 느림)
   */
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

// if (module.hot) {
//   module.hot.accept('./addNav.js', function () {
//     console.log('ADDNAV: changed');
//     console.log('------------------------');
//   });
// }

export default myApp;
