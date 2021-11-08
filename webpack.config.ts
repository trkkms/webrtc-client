import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyPlugin from 'copy-webpack-plugin';

const devServer: WebpackDevServer.Configuration = {
  port: 5000,
};

export interface WebpackEnv {
  production?: boolean;
}

const webpackConfig: (env: WebpackEnv) => webpack.Configuration & { devServer: WebpackDevServer.Configuration } = (
  env,
) => {
  const isProduction = env.production;
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? undefined : 'eval-source-map',
    entry: {
      main: './src/main.tsx',
    },
    output: {
      path: `${__dirname}/docs`,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.json$/,
          use: 'json-loader',
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    target: ['web'],
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/html/index.html',
        filename: 'index.html',
        scriptLoading: 'defer',
        hash: true,
      }),
      new CopyPlugin({
        patterns: [{ from: 'public' }],
      }),
    ],
    devServer,
  };
};

export default webpackConfig;
