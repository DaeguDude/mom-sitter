import addHeader from './addHeader';
import addNav from './addNav';
import '../styles/style.css';

function App() {
  const render = () => {
    addHeader();
    addNav('api');
  };

  return { render };
}

const myApp = App();

export default myApp;
