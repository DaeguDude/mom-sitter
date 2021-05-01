import createFragment from '../helpers/cretateFragment';

function createSearchTab(tab) {
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

  return UI;
}

export default createSearchTab;
