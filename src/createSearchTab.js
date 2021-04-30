import createFragment from './createFragment';

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
