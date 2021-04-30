function clearPage() {
  const userListSection = document.querySelector('.userlist-section');
  while (userListSection.firstChild) {
    userListSection.removeChild(userListSection.firstChild);
  }
}

export default clearPage;
