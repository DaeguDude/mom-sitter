import createSearchTab from './addSearchTab';
import createSearchBar from './addSearchBar';

function addNav(tab) {
  const userListSection = document.querySelector('.userlist-section');

  const nav = document.createElement('nav');
  nav.className = 'userlist-section__nav';

  nav.appendChild(createSearchTab(tab));
  nav.appendChild(createSearchBar(tab));

  return userListSection.appendChild(nav);
}

export default addNav;
