import { Octokit } from '@octokit/core';
import config from '../config';
import Favorite from './Favorite';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(name) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

  return makeNewUserList(searchResponse);
}

function makeNewUserList(response) {
  const userList = response.data.items;

  const newUserList = userList.map((userInfo) => {
    const { login, avatar_url } = userInfo;
    const is_favorite = Favorite.doesExist(login);

    return { login, avatar_url, is_favorite };
  });

  return newUserList;
}

export default getUser;
