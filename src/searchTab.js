function searchTab() {
  const state = {
    tab: 'api',
  };

  const setTab = (tab) => {
    state.tab = tab;

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tabUI) => {
      tabUI.classList.toggle('tab--active');
    });
  };

  const getCurrentTab = () => {
    return state.tab;
  };

  return { setTab, getCurrentTab };
}

const mySearchTab = searchTab();

export default mySearchTab;
