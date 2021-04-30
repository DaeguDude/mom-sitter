function addMain() {
  const userListSection = document.querySelector('.userlist-section');

  const UI = document.createRange().createContextualFragment(`
    <main class="users">
      <div class="users__row">
        <span class="users__row-title">a</span>
      </div>
    </main>  
  `);

  return userListSection.appendChild(UI);
}

export default addMain;
