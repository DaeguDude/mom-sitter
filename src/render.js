import { Root, initialState } from './state';
// import state from './state';
import clearPage from './clearPage';
import addHeader from './addHeader';
import addNav from './addNav';
import addMain from './addMain';

function render(state) {
  const tab = state ? state.currentTab : initialState.currentTab;

  const onSearchChangeHandler = Root.onSearchChangeHandler;
  const onTabChange = Root.onTabChange;

  clearPage();
  addHeader();
  addNav(tab, onSearchChangeHandler, onTabChange);
  addMain();
}

export { render };
