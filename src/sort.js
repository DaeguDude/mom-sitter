const isKorean = (str) => {
  const regExp = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;
  if (regExp.test(str)) {
    return true;
  }
  return false;
};

const isEnglish = (str) => {
  const regExp = /^[a-zA-Z]*$/;
  if (regExp.test(str)) {
    return true;
  }
  return false;
};
