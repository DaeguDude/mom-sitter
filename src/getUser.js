import { Octokit } from '@octokit/core';
import config from '../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(name) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: name,
    headers: {
      accept: 'application/vnd.github.v3.text-match+json',
    },
  });

  const getResponse = await octokit.request('GET /users/{username}', {
    username: name,
  });

  console.log('Search Response: ', searchResponse);
  console.log('-----');
  console.log('Get Response: ', getResponse);
}

export default getUser;
