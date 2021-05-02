import createFragment from '../helpers/cretateFragment';

/**
 * 현재 탭 정보와 콜백 함수를 받아 탭 클릭시 현재 탭을 바꾸어 주는
 * documentFragment를 반환해 줌
 *
 * @param {string} tab - 현재 탭 정보
 * @param {function} onTabChange - 현재 탭 정보를 바꿔 줄 콜백 함수
 * @returns {documentFragment} - 사용자 정보를 담은 documentFragment
 */
function createSearchTab(tab, onTabChange) {
  let UI;

  if (tab === 'api') {
    const tabAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab tab--active">api</div>
        <div class="tab-local tab">로컬</div>
      </div>
    `;

    UI = createFragment(tabAPI);
  }

  if (tab === 'local') {
    const localAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab">api</div>
        <div class="tab-local tab tab--active">로컬</div>
      </div>
    `;

    UI = createFragment(localAPI);
  }
  const searchTab = UI.querySelector('.userlist-section__search-tab');
  searchTab.addEventListener('click', onTabChange);

  return UI;
}

export default createSearchTab;
