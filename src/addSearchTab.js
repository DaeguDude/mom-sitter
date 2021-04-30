function createSearchTab(tab) {
  if (tab === 'api') {
    const tabAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab tab--active">api</div>
        <div class="tab-local tab">로컬</div>
      </div>
    `;

    const UI = createFragment(tabAPI);
    return UI;
  }

  if (tab === 'local') {
    const localAPI = `
      <div class="userlist-section__search-tab row">
        <div class="tab-api tab">api</div>
        <div class="tab-local tab tab--active">로컬</div>
      </div>
    `;

    const UI = createFragment(localAPI);
    return UI;
  }
}

function createFragment(elementHTML) {
  return document.createRange().createContextualFragment(elementHTML);
}

export default createSearchTab;
