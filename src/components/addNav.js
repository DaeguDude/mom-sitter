import createSearchTab from './createSearchTab';
import createSearchBar from './createSearchBar';

function addNav(
  tab,
  onTabChange,
  searchInputValue,
  onSearchChangeHandler,
  onSearchHandler
) {
  const userListSection = document.querySelector('.userlist-section');

  const nav = document.createElement('nav');
  nav.className = 'userlist-section__nav';

  nav.appendChild(createSearchTab(tab, onTabChange));
  nav.appendChild(
    createSearchBar(searchInputValue, onSearchChangeHandler, onSearchHandler)
  );

  return userListSection.appendChild(nav);
}

export default addNav;
