import { Octokit } from '@octokit/core';
import config from '../config';

const octokit = new Octokit({
  auth: config.githubToken,
});

async function getUser(name) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: name,
    per_page: 100,
    page: 1,
  });

  console.log('Search Response: ', searchResponse);
  console.log('-----');
}

export default getUser;
