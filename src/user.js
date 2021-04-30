// userInfo - object
import Favorite from './Favorite';

function createUserUI(userInfo) {
  const { avatar_url, login } = userInfo;
  let is_favorite = userInfo.is_favorite;
  let userElem = null;

  // 클릭 되었을 시, 가장 먼저 해야 되는 것.
  // 이 사람이, 즐겨찾기에 추가된 사람인지?
  // 예스 - 즐겨찾기 아이콘을 색칠을 지워줌, 즐겨찾기에서 사용자를 지워줌
  // 노우 - 즐겨찾기 아이콘에 색깔을 칠함, 즐겨찾기에 사용자를 추가함

  const userUI = document.createRange().createContextualFragment(`
    <div class="user row">
      <img class="user__img" src="${avatar_url}" />
      <span class="user__name">${login}</span>
      <button class="user__favorite">
        ${is_favorite ? starIconActive : starIcon}
      </button>
    </div>
  `);

  const onFavoriteHandler = () => {
    const userName = getUserName();
    if (Favorite.doesExist(userName)) {
      toggleFavorite();
      Favorite.removeUser(userName);
    } else {
      toggleFavorite();
      Favorite.addUser({ avatar_url, login, is_favorite });
    }
  };

  const getUserName = () => {
    return userElem.querySelector('.user__name').innerText;
  };

  const toggleFavorite = () => {
    is_favorite = !is_favorite;

    const favoriteIcon = userElem.querySelector('.star-icon');
    favoriteIcon.classList.toggle('star-icon--active');
  };

  const bindUserUiElement = () => {
    userElem = userUI.querySelector('.user');
  };

  userUI //
    .querySelector('.user')
    .addEventListener('click', onFavoriteHandler);

  bindUserUiElement();
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

export default createUserUI;
