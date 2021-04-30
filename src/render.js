import clearPage from './clearPage';
import addHeader from './addHeader';
import addNav from './addNav';
import addSearchTab from './addSearchTab';
import addSearchBar from './addSearchBar';
import addMain from './addMain';

function render() {
  clearPage();
  addHeader();
  addNav('api');
  addMain();
}

export { render, addSearchTab, addSearchBar };
