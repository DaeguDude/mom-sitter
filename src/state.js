const state = {
  currentTab: 'api',
  favorites: JSON.parse(localStorage.getItem('users')),
};

export default state;
