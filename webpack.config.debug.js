const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const slsw = require('serverless-webpack');

module.exports = {
  devtool: 'source-map',
  entry: env.JOBS ? jobsEntries : slsw.lib.entries,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              configFile: 'tsconfig.debug.json',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    sourceMapFilename: '[file].map',
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  plugins: [],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.paths.json',
      }),
    ],
  },
  target: 'node',
};
