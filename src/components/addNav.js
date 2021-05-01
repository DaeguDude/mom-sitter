import createSearchTab from './createSearchTab';
import createSearchBar from './createSearchBar';

function addNav(tab) {
  const userListSection = document.querySelector('.userlist-section');

  const nav = document.createElement('nav');
  nav.className = 'userlist-section__nav';

  nav.appendChild(createSearchTab(tab));
  nav.appendChild(createSearchBar());

  return userListSection.appendChild(nav);
}

export default addNav;