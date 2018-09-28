const {getLoader} = require('react-app-rewired');
const rewireCssModule = require('react-app-rewire-css-modules-extensionless');
const rewireLess = require('react-app-rewire-less-modules');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = function override (config, env) {
  config = rewireCssModule.webpack(config, env, {
    test: /\.module\.css$/,
  });

  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true
  })(config, env);

  const tsLoader = getLoader(config.module.rules, rule => {
    return /ts-loader/.test(rule.loader);
  });

  tsLoader.options.getCustomTransformers = () => ({
    before: [tsImportPluginFactory({
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true
    })],
  });

  return config;
};
