/**
 * 사용자 정보와 즐겨찾기에 추가 삭제 해주는 함수를 받아, 동적으로 documentFragment를
 * 만들어 즐겨찾기를 핸들링 해주는 함수를 클릭 이벤트를 등록시켜 되돌려 준다
 *
 * @param {Object} userInfo - 유저 정보
 * @param {string} userInfo.avatar_url - 유저 이미지 주소
 * @param {string} userInfo.login - 유저 이름
 * @param {boolean} userInfo.is_favorite - 유저 즐겨찾기 등록 여부
 * @param {function} onFavoriteHandler - 즐겨찾기를 추가 삭제 해주는 콜백 함수
 * @returns {documentFragment} - 사용자 정보를 담은 documentFragment
 */
function createUser(userInfo, onFavoriteHandler) {
  const { avatar_url, login, is_favorite } = userInfo;
  const userUI = document.createRange().createContextualFragment(`
    <div class="user">
      <div class="container row">
        <img class="user__img" src="${avatar_url}" />
        <span class="user__name">${login}</span>
        <button class="user__favorite">
          ${is_favorite ? starIconActive : starIcon}
        </button>
      </div>
    </div>
  `);

  userUI //
    .querySelector('.user')
    .addEventListener('click', () => onFavoriteHandler(userInfo));

  return userUI;
}

const starIcon = `
  <svg
    class="star-icon"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#000000"
  >
    <g>
      <path d="M0,0h24v24H0V0z" fill="none" />
      <path d="M0,0h24v24H0V0z" fill="none" />
    </g>
    <g>
      <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
    </g>
  </svg>
`;

const starIconActive = `
    <svg
      class="star-icon star-icon--active"
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <g>
        <path d="M0,0h24v24H0V0z" fill="none" />
        <path d="M0,0h24v24H0V0z" fill="none" />
      </g>
      <g>
        <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
      </g>
    </svg>
  `;

export default createUser;
