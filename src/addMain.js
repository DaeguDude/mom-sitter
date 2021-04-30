import createFragment from './createFragment';
import createUserList from './userList';

function addMain(currentSearchResult) {
  console.log({ currentSearchResult });
  const userListSection = document.querySelector('.userlist-section');

  // const UI = createFragment(`
  //   <main class="users">
  //     <div class="users__row">
  //       <span class="users__row-title">a</span>
  //     </div>
  //   </main>
  // `);

  const users = document.createElement('main');
  users.className = 'users';

  const usersRow = document.createElement('div');
  usersRow.className = 'users__row';

  const usersRowTitle = document.createElement('span');
  usersRowTitle.className = 'users__row-title';
  usersRowTitle.innerText = 'a';

  users.appendChild(usersRow);
  usersRow.appendChild(usersRowTitle);

  if (currentSearchResult !== null) {
    currentSearchResult.forEach((userInfo) => {
      const UIs = createUserList(currentSearchResult);
      UIs.forEach((userUI) => {
        usersRow.appendChild(userUI);
      });
    });
  }

  return userListSection.appendChild(users);
}

export default addMain;
