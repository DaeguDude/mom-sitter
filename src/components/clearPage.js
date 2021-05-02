/**
 * 화면 상의 모든 노드들을 지워 줌
 */
function clearPage() {
  const userListSection = document.querySelector('.userlist-section');
  while (userListSection.firstChild) {
    userListSection.removeChild(userListSection.firstChild);
  }
}

export default clearPage;
