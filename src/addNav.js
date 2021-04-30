import createSearchTab from './createSearchTab';
import createSearchBar from './createSearchBar';

function addNav(tab, onSearchChangeHandler, onTabChange) {
  const userListSection = document.querySelector('.userlist-section');

  const nav = document.createElement('nav');
  nav.className = 'userlist-section__nav';

  nav.appendChild(createSearchTab(tab, onTabChange));
  nav.appendChild(createSearchBar(tab, onSearchChangeHandler));

  return userListSection.appendChild(nav);
}

export default addNav;
