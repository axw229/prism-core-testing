const envVars = require('./constants.env-vars')

// define templates dev server origin
process.env[envVars.TEMPLATES_LOCAL_PROTOCOL] = process.env[envVars.TEMPLATES_LOCAL_PROTOCOL] || 'https'
process.env[envVars.TEMPLATES_LOCAL_HOST] = process.env[envVars.TEMPLATES_LOCAL_HOST] || 'localhost'
process.env[envVars.TEMPLATES_LOCAL_PORT] = process.env[envVars.TEMPLATES_LOCAL_PORT] || '8082'
process.env[envVars.TEMPLATES_LOCAL_ORIGIN] = `${process.env[envVars.TEMPLATES_LOCAL_PROTOCOL]}://${process.env[envVars.TEMPLATES_LOCAL_HOST]}${process.env[envVars.TEMPLATES_LOCAL_PORT] ? `:${process.env[envVars.TEMPLATES_LOCAL_PORT]}` : ''}`// default local URL to localhost

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')
const flags = require('./constants')
const templateConstants = require('./constants.templates')
const requireContext = require('require-context')
const alias = require('./partial.resolve.alias')
const stats = require('./partial.stats')
const optimization = require('./partial.optimization')
const moduleRuleJsx = require('./partial.module.rules.jsx')

// create constants that correlate to environment variables to be injected
const APP_VERSION = process.env.npm_package_version
const APP_NAME = process.env.npm_package_name

const ENV = process.env[envVars.NODE_ENV] ? process.env[envVars.NODE_ENV] : 'development'
const BASE_PATH = (ENV === 'development') ? process.env[envVars.PRISM_LOCAL_ORIGIN] : (process.env[envVars.WEB_URL]) ? process.env[envVars.WEB_URL] : '$WEB_URL'

// TODO: Use this same concept to eliminate the redundancy of facetEntryPoints in constants and allFacets.js -@cody.richmond
const TEMPLATES_SRC_LOCATION = path.join(templateConstants.srcTemplatesPath, '/templates/')

const TEMPLATES_DIST_LOCATION = 'templates/'
const allTemplates = (ctx => {
  return ctx.keys().map(template => ({
    input: `${TEMPLATES_SRC_LOCATION}${template}`,
    output: path.join(templateConstants.templatesDistDir, TEMPLATES_DIST_LOCATION, template.replace(/(.*)\.ejs/, '$1.html'))
  }))
})(requireContext(path.resolve(__dirname, TEMPLATES_SRC_LOCATION), true, /.*/))

const allEntryPoints = {
  [templateConstants.templateIndexEntryPointName]: templateConstants.templateIndexPath
}

const DEFINED_VARS = {
  'APP_NAME': APP_NAME,
  'APP_VERSION': APP_VERSION,
  'BASE_PATH': BASE_PATH,
  'ENV': ENV,
  'WEBPACK_CONSTANTS': flags,
  'STATIC_TEMPLATES': allTemplates.map(template => template.output)
}

module.exports = {
  name: 'prismTemplates',
  stats: stats,
  target: 'web',
  watch: false,
  cache: !flags.production,
  devtool: false,
  context: flags.rootPath,
  mode: flags.mode,
  entry: allEntryPoints,
  output: {
    path: flags.distPath,
    filename: flags.production ? 'prism-templates/js/[name].[contenthash].js' : 'prism-templates/js/[name].js',
    globalObject: 'self'
  },
  resolve: {
    symlinks: false,
    alias: alias
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: flags.nodeModulesPath,
        resolve: {
          mainFields: ['module', 'jsnext:main', 'browser', 'main']
        }
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      moduleRuleJsx,
      {
        test: /\.ejs$/,
        use: [
          'html-loader',
          {
            loader: 'ejs-html-loader',
            options: DEFINED_VARS
          }
        ]
      }
    ]
  },
  optimization: optimization,
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(templateConstants.srcTemplatesPath, 'index/index.ejs'),
      filename: path.resolve(flags.distPath, 'index.html')
    }),
    ...allTemplates.map(template => {
      return new HtmlWebpackPlugin({
        inject: false,
        filename: `${template.output}`,
        template: `${template.input}`
      })
    }),
    new MiniCssExtractPlugin({
      filename: flags.production ? 'prism-templates/css/[name].[contenthash].css' : 'prism-templates/css/[name].css'
    }),
    new webpack.DefinePlugin(Object.entries(DEFINED_VARS).reduce((last, next) => ({ ...last, [next[0]]: JSON.stringify(next[1]) }), {}))
  ].filter(p => p)
}
