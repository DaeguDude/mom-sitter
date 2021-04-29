function sortByLogin(userList) {
  const newUserList = [...userList];
  newUserList.sort((a, b) => {
    return a.login.localeCompare(b.login);
  });

  return newUserList;
}

export default sortByLogin;
