const path = require('path');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  devtool: false,
  entry: slsw.lib.entries,
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
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
