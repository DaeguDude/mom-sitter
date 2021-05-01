import addHeader from './addHeader';
import createSearchTab from './createSearchTab';
import '../styles/style.css';

function App() {
  const render = () => {
    addHeader();
    const userListSection = document.querySelector('.userlist-section');
    userListSection.appendChild(createSearchTab('api'));
  };

  return { render };
}

const myApp = App();

export default myApp;
