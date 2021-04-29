import getUser from './getUser';

function component() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const findBtn = document.createElement('button');
  form.appendChild(input);
  form.appendChild(findBtn);

  findBtn.innerHTML = '유저찾기';
  findBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currInputValue = input.value;
    input.value = '';
    getUser(currInputValue);
  });

  return form;
}

document.body.appendChild(component());
