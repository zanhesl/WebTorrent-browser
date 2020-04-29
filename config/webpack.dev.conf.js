const webpack = require('webpack');
const merge = require('webpack-merge');
const { spawn } = require('child_process');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: false,
      errors: true,
    },
    before() {
      spawn('electron', ['.'], { shell: true, env: process.env, stdio: 'inherit' })
        .on('close', () => process.exit(0))
        .on('error', spawnError => console.error(spawnError));
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
