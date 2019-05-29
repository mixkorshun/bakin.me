const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');

const sourcePath = path.resolve(__dirname, 'src');

module.exports = (env) => {
  if (!env || (!env.outputPath && !env.devServer)) {
    throw new Error(
      'Please specify output path using --env.outputPath=... or use --env.devServer',
    );
  }

  const outputPath = path.resolve(__dirname, env.outputPath || '.tmp');

  return {
    context: sourcePath,
    mode: env && env.mode || 'development',
    stats: 'errors-only',

    output: {
      path: outputPath,
      publicPath: env.publicPath || '/',

      filename: 'assets/[name].[hash].js',
      chunkFilename: 'assets/[name].[chunkhash].js',
    },

    entry: {
      styles: './less/main.less',
    },

    resolve: {
      alias: {
        'public': path.resolve(__dirname, 'public'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(less|css)$/,
          //sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {importLoaders: 2},
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer'),
                  require('cssnano')({
                    preset: 'default',
                  }),
                ],
              },
            },
            {
              loader: 'less-loader',
            },
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

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/[name].[hash].css',
        chunkFilename: 'assets/[name].[hash].css',
        allChunks: true,
      }),

      new FaviconsWebpackPlugin({
        // Your source logo
        logo: path.resolve('public/favicon.png'),
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
      minimize: env && env.mode === 'production',
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
