import createFragment from '../helpers/cretateFragment';

function createSearchBar(
  searchInputValue,
  onSearchChangeHandler,
  onSearchHandler
) {
  const UI = createFragment(`
    <div class="userlist-section__search-bar">
      <div class="container row row-between">
        <input class="userlist-section__search-input" type=text"
        placeholder="검색어를 입력하세요">
        <button class="userlist-section__search-btn">
          <svg class="userlist-section__search-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 0 24 24"
            width="48px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </div>
    </div>
  `);

  const searchInput = UI.querySelector('.userlist-section__search-input');
  searchInput.value = searchInputValue;
  searchInput.addEventListener('change', (e) => {
    onSearchChangeHandler(e);
  });

  const searchBtn = UI.querySelector('.userlist-section__search-btn');
  searchBtn.addEventListener('click', (e) => {
    onSearchHandler(e);
  });

  return UI;
}

export default createSearchBar;
