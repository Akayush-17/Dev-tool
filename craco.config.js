module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.entry = {
          main: './src/index.js',
          background: './public/background.js',
          content: './public/content.js',
        };
        webpackConfig.output.filename = 'static/js/[name].js';
        return webpackConfig;
      },
    },
  };
  