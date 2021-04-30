import createUserUI from './user';

// userList - array
function createUserList(userList) {
  // 배열 userList -> userList UI로 만들어 줄 것
  const userListUI = userList.map((userInfo) => {
    return createUserUI(userInfo);
  });

  return userListUI;
}

export default createUserList;
