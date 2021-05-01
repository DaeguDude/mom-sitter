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

  const render = () => {
    clearPage();
    addHeader();
    addNav('api');
    addMain();
  };

  return { render };
}

const myApp = App();

export default myApp;
