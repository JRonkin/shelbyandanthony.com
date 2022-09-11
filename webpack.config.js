const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RenderSoyPlugin = require('./render-soy-plugin.js');

const srcPath = path.resolve(__dirname, 'src');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = env => ({
  devtool: env.production ? false : 'source-map',
  entry: {
    about: path.resolve(srcPath, 'js', 'pages', 'about.js'),
    fourOhFour: path.resolve(srcPath, 'js', 'pages', 'fourOhFour.js'),
    home: path.resolve(srcPath, 'js', 'pages', 'home.js'),
    itinerary: path.resolve(srcPath, 'js', 'pages', 'itinerary.js'),
    registry: path.resolve(srcPath, 'js', 'pages', 'registry.js'),
    travel: path.resolve(srcPath, 'js', 'pages', 'travel.js')
  },
  mode: env.production ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  ['postcss-line-height-px-to-unitless'],
                  [
                    'postcss-pxtorem',
                    {
                      mediaQuery: true,
                      propList: ['*'],
                      rootValue: 16
                    }
                  ]
                ]
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin()
    ]
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: outputPath
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(srcPath, 'assets'),
          to: path.resolve(outputPath, '[path][name].[contenthash:8][ext]')
        },
        {
          from: path.resolve(srcPath, 'static'),
          to: outputPath
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new RenderSoyPlugin({
      templateData: {
        blockSearchEngines: true,
        hostname: 'www.shelbyandanthony.com',
        isoTimestamp: new Date().toISOString(),
        protocol: 'https:'
      },
      templateFiles: path.resolve(srcPath, 'templates', '**', '*.soy'),
      templates: {
        'file.cname': 'url.cname',
        'file.robots_txt': 'url.robots_txt',
        'file.sitemap_xml': 'url.sitemap_xml',
        'page.about': 'url.about',
        'page.fourOhFour': 'url.fourOhFour',
        'page.home': 'url.home',
        'page.itinerary': 'url.itinerary',
        'page.registry': 'url.registry',
        'page.travel': 'url.travel'
      }
    })
  ]
});
