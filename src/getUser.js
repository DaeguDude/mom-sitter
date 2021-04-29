import { Octokit } from '@octokit/core';
import config from '../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(name) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

  console.log(getNewUserList(searchResponse));
}

function getNewUserList(response) {
  const userList = response.data.items;

  const newUserList = userList.map((userInfo) => {
    const { login, avatar_url } = userInfo;
    return { login, avatar_url, is_favorite: false };
  });

  return newUserList;
}

export default getUser;
