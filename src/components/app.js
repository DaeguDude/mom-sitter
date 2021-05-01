import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';
import '../styles/style.css';
import clearPage from './clearPage';

const userInfo = {
  login: 'DaeguDude',
  avatar_url: 'https://avatars.githubusercontent.com/u/35420073?v=4',
  is_favorite: true,
};

const userInfo2 = {
  login: 'DaeguDude',
  avatar_url: 'https://avatars.githubusercontent.com/u/35420073?v=4',
  is_favorite: false,
};

const userList = [userInfo, userInfo2];

function App() {
  const render = () => {
    clearPage();
    addHeader();
    addNav('api');
    addMain(userList);
  };

  return { render };
}

const myApp = App();

export default myApp;
