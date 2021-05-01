import addHeader from './addHeader';
import createSearchTab from './createSearchTab';
import createSearchBar from './createSearchBar';
import '../styles/style.css';

function App() {
  const render = () => {
    addHeader();
    const userListSection = document.querySelector('.userlist-section');
    userListSection.appendChild(createSearchTab('api'));
    userListSection.appendChild(createSearchBar());
  };

  return { render };
}

const myApp = App();

export default myApp;
