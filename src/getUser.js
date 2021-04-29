import { Octokit } from '@octokit/core';
import config from '../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(name) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: name,
  });

  console.log('Search Response: ', searchResponse);
  console.log('-----');
}

export default getUser;
