import createSearchTab from './createSearchTab';
import createSearchBar from './createSearchBar';

/**
 * 현재 앱의 상태를 받아, 검색 탭과 검색 창을 렌더링 해 줌
 *
 * @param {string} tab - 현재 탭 정보
 * @param {function} onTabChange - 현재 탭 정보를 바꿔 줄 콜백 함수
 * @param {string} searchInputValue - 현재 검색할 유저 이름
 * @param {function} onSearchChangeHandler - 현재 검색할 유저 이름을 관리해 주는 콜백 함수
 * @param {function} onSearchHandler - 검색 버튼 클릭시 사용자 이름을 받아 사용자 리스트를 받아와주는 콜백 함수
 * @returns {}
 */
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
