import createFragment from './createFragment';

function addMain() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = createFragment(`
    <main class="users">
      <div class="users__row">
        <span class="users__row-title">a</span>
      </div>
    </main>  
  `);

  return userListSection.appendChild(UI);
}

export default addMain;
