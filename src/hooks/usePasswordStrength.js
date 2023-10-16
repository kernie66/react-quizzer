import { zxcvbnOptions, zxcvbnAsync } from "@zxcvbn-ts/core";
// import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
// import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
// import * as zxcvbnFiPackage from "@zxcvbn-ts/language-fi";
// import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";

// optional
// const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions);
// zxcvbnOptions.addMatcher("pwned", matcherPwned);

const loadOptions = async () => {
  const zxcvbnCommonPackage = await import(
    /* webpackChunkName: "zxcvbnCommonPackage" */ "@zxcvbn-ts/language-common"
  );
  const zxcvbnEnPackage = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ "@zxcvbn-ts/language-en"
  );
  const zxcvbnFiPackage = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ "@zxcvbn-ts/language-fi"
  );

  return {
    // recommended
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
      // recommended the language of the country that the user will be in
      ...zxcvbnFiPackage.dictionary,
    },
    // recommended
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    // recommended
    useLevenshteinDistance: true,
    // optional
    // translations: zxcvbnEnPackage.translations,
  };
};

/*
const options = {
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    // recommended the language of the country that the user will be in
    ...zxcvbnFiPackage.dictionary,
  },
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // recommended
  useLevenshteinDistance: true,
  // optional
  // translations: zxcvbnEnPackage.translations,
};
zxcvbnOptions.setOptions(options);
*/

const usePasswordStrength = async (password) => {
  if (!sessionStorage.getItem("zxcvbnOptions")) {
    const options = await loadOptions();
    zxcvbnOptions.setOptions(options);
    sessionStorage.setItem("zxcvbnOptions", "Loaded");
    console.info("Password dictionaries loaded...");
  }
  const response = await zxcvbnAsync(password);
  return response;
};

export default usePasswordStrength;
