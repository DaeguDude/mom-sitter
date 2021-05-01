import addHeader from './addHeader';
import addNav from './addNav';
import createUser from './createUser';
import '../styles/style.css';

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

function App() {
  const render = () => {
    addHeader();
    addNav('api');

    const userListSection = document.querySelector('.userlist-section');
    userListSection.appendChild(createUser(userInfo));
    userListSection.appendChild(createUser(userInfo2));
  };

  return { render };
}

const myApp = App();

export default myApp;
