import { Octokit } from '@octokit/core';
import config from '../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(usersToSearch) {
  console.log(usersToSearch);
  const response = await octokit.request('GET /search/users', {
    q: usersToSearch,
  });

  console.log(response);
}

export default getUser;
