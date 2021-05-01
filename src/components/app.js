import addHeader from './addHeader';

function App() {
  const render = () => {
    addHeader();
  };

  return { render };
}

const myApp = App();

export default myApp;
