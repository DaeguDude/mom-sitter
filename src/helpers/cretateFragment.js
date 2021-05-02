/**
 * HTML로 만들어질 문자열을 받아 documentFragment를 만들어준다
 *
 * @param {string} elementHTML - documentFragment로 만들 HTML 내용을 담은 문자열
 * @returns {documentFragment} - elementHTML을 받아 만들어진 documentFragment
 */
function createFragment(elementHTML) {
  return document.createRange().createContextualFragment(elementHTML);
}

export default createFragment;
