import { Octokit } from '@octokit/core';
// import config from '../../config';
import sortUserByAlphabet from './sortUserByAlphabet';

let serverURL;

fetch('my_functions/api')
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
  });

const octokit = new Octokit({
  // auth: config.githubToken,
});

/**
 * 검색할 유저이름을 받아 사용자 검색 후 검색 된 사용자 리스트를 알파벳순으로 정렬하여 되돌려 줌
 *
 * @param {string} name - 검색할 유저 이름
 * @param {Object[]} favorites - 즐겨찾기에 등록된 사용자 리스트
 * @param {string} favorites[].avatar_url - 유저 이미지 주소
 * @param {string} favorites[].login - 유저 이름
 * @param {boolean} favorites[].is_favorite - 유저 즐겨찾기 등록 여부
 * @returns {Object[]} 검색 된 유저리스트를 알파벳순으로 정렬하여 돌려줌
 */
async function getUserList(name, favorites) {
  const searchResponse = await octokit.request('GET /search/users', {
    q: `${name} in:login type:user`,
    per_page: 100,
    page: 1,
  });

  const userList = makeNewUserList(searchResponse, favorites);

  return sortUserByAlphabet(userList);
}

/**
 * 깃허브 응답을 받아 프로필 이미지, 유저이름, 즐겨찾기 여부를 담은 사용자 리스트를 반환
 *
 * @param {Object} response - 깃허브로 부터 받아온 search 응답
 * @param {Object[]} favorites - 즐겨찾기에 등록된 사용자 리스트
 * @param {string} favorites[].avatar_url - 유저 이미지 주소
 * @param {string} favorites[].login - 유저 이름
 * @param {boolean} favorites[].is_favorite - 유저 즐겨찾기 등록 여부
 * @returns {Object[]} - search 응답에서 필요한 것들만 간추려 새로운 사용자 리스트를 돌려 줌
 */
function makeNewUserList(response, favorites) {
  const userList = response.data.items;

  const newUserList = userList.map((userInfo) => {
    const { login, avatar_url } = userInfo;
    const is_favorite = doesExistInFavorites(login, favorites);

    return { login, avatar_url, is_favorite };
  });

  return newUserList;
}

/**
 * 유저 이름을 받아, 즐겨찾기에 등록되어 있는 여부를 확인하여 줌
 *
 * @param {string} userName - 유저 이름
 * @param {Object[]} favorites - 즐겨찾기에 등록된 사용자 리스트
 * @param {string} favorites[].avatar_url - 유저 이미지 주소
 * @param {string} favorites[].login - 유저 이름
 * @param {boolean} favorites[].is_favorite - 유저 즐겨찾기 등록 여부
 * @returns {boolean} - 즐겨찾기 등록 여부
 */
function doesExistInFavorites(userName, favorites) {
  if (favorites === null) {
    return false;
  }

  const result = favorites.find((userInfo) => userInfo.login === userName);

  return result ? true : false;
}

export default getUserList;
