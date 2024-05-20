import { zxcvbnOptions, zxcvbnAsync } from "@zxcvbn-ts/core";
import { matcherPwnedFactory } from "@zxcvbn-ts/matcher-pwned";
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

const getPasswordStrength = async (password, userInputs) => {
  const loaded = localStorage.getItem("dictionaries");
  if (!loaded) {
    // optional
    const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions);
    zxcvbnOptions.addMatcher("pwned", matcherPwned);

    const options = await loadOptions();
    zxcvbnOptions.setOptions(options);
    console.log("Password dictionaries loaded...");
    localStorage.setItem("dictionaries", "loaded");
  }
  const response = await zxcvbnAsync(password, userInputs);
  return response;
};

export default getPasswordStrength;
