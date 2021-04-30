import getUser from './getUser';
import './styles/style.css';
import createUserList from './userList';
import Favorite from './Favorite';
import mySearchTab from './searchTab';

import myApp from './myApp';

myApp.render();

// const app = document.querySelector('.userlist-section');
// app.addEventListener('click', async (event) => {
//   const classList = event.target.classList;
//   if (classList.contains('userlist-section__search-icon')) {
//     const usersToSearch = document.querySelector(
//       '.userlist-section__search-input'
//     ).value;
//     const searchList = await getUser(usersToSearch);
//     console.log(searchList);
//   }
// });

// DEVELOP
// const header = document.querySelector('.userlist-section__header');
// const logCurrentStorageBtn = document.createElement('button');
// logCurrentStorageBtn.innerText = 'log users in favorite';
// logCurrentStorageBtn.addEventListener('click', logUsersInFavorite);

// const clearStorageBtn = document.createElement('button');
// clearStorageBtn.innerText = 'clear favorite storage';
// clearStorageBtn.addEventListener('click', clearLocalStorage);
// header.appendChild(logCurrentStorageBtn);
// header.appendChild(clearStorageBtn);

// // MAIN
// const searchBtn = document.querySelector('.userlist-section__search-btn');
// searchBtn.addEventListener('click', async () => {
//   resetUserListUI();

//   const usersToSearch = document.querySelector(
//     '.userlist-section__search-input'
//   ).value;
//   const userList = await getUser(usersToSearch);
//   const usersRow = document.querySelector('.users__row');
//   const userListUI = createUserList(userList);
//   userListUI.forEach((userUI) => {
//     usersRow.appendChild(userUI);
//   });
// });

// function resetUserListUI() {
//   const usersRow = document.querySelector('.users__row');
//   while (usersRow.firstChild) {
//     usersRow.firstChild.remove();
//   }
// }

// // logUsersInFavorite
// function logUsersInFavorite() {
//   console.log(Favorite.getUserData());
// }

// function clearLocalStorage() {
//   localStorage.clear();
//   logUsersInFavorite();
// }
