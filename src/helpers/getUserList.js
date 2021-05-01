import { Octokit } from '@octokit/core';
import config from '../../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUserList(name, favorites) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

  return makeNewUserList(searchResponse, favorites);
}

function makeNewUserList(response, favorites) {
  const userList = response.data.items;

  const newUserList = userList.map((userInfo) => {
    const { login, avatar_url } = userInfo;
    const is_favorite = doesExistInFavorites(login, favorites);

    return { login, avatar_url, is_favorite };
  });

  return newUserList;
}

function doesExistInFavorites(userName, favorites) {
  if (favorites === null) {
    return false;
  }

  const result = favorites.find((userInfo) => userInfo.login === userName);

  return result ? true : false;
}

export default getUserList;
