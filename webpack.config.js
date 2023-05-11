const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ?? "development";
const IS_PRODUCTION = NODE_ENV === "production";

const sourcePath = path.resolve(__dirname, 'src');

module.exports = (env) => {
  if (IS_PRODUCTION && !env?.outputPath) {
    throw new Error('Please specify output path using --env.outputPath=...');
  }

  const outputPath = path.resolve(__dirname, env.outputPath || '.tmp');

  return {
    context: sourcePath,
    mode: NODE_ENV,
    stats: 'errors-only',

    output: {
      path: outputPath,
      publicPath: env.publicPath || '/',

      filename: 'assets/[name].[contenthash].js',
    },

    entry: './main.css',

    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader'},
            {loader: 'postcss-loader'}
          ],
        },

        {
          test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
          ...fileLoaderExt({
            name: 'assets/images/[name].[hash].[ext]',
            limit: 1024,
          }),
        },
      ],
    },

    plugins: [
      renderHtml('index.html'),

      new MiniCssExtractPlugin({
        filename: 'assets/[name].[hash].css',
        chunkFilename: 'assets/[name].[hash].css',
      }),

      new FaviconsWebpackPlugin({
        // Your source logo
        logo: path.resolve(__dirname, 'src/assets/favicon.png'),
        prefix: 'assets/favicon.[hash]/',
        emitStats: false,
        statsFilename: 'iconstats-[hash].json',
        persistentCache: true,
        // Inject the html into the html-webpack-plugin
        inject: true,
        background: '#fff',
        title: 'Vladislav Bakin',

        // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false,
        },
      }),
    ],

    optimization: {
      minimize: IS_PRODUCTION,
    },

    devServer: {
      historyApiFallback: true,
      port: 8080,
    },
  };
};

const fileLoaderExt = ({name, limit}) => {
  return {
    oneOf: [
      {
        test: /\.inline\.(\w+)$/,
        use: 'url-loader',
      },
      {
        test: /\.external\.(\w+)$/, use: {
          loader: 'file-loader', options: {
            name: name,
          },
        },
      },
      {
        use: {
          loader: 'url-loader',
          options: {
            name: name,
            limit: limit,
          },
        },
      },
    ],
  };
};

function renderHtml(name, ...options) {
  return new HtmlWebpackPlugin({
    template: name,
    filename: name,
    inject: 'body',
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    },
    ...options,
  });
}
