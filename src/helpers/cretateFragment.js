function createFragment(elementHTML) {
  return document.createRange().createContextualFragment(elementHTML);
}

export default createFragment;
