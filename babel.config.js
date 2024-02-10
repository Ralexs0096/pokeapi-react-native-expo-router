module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // https://docs.expo.dev/router/installation/#modify-babelconfigjs
  };
};
