var webpack     = require('webpack');
var path        = require('path');
var bower_dir   = __dirname + '/app/assets/bower_components';


module.exports = {
  entry:{
    app:[
      './app/assets/scripts/pageIndex.js',
      './app/assets/scripts/pageKitchensink.js'
    ],
    vendors: [
      'jquery'
    ]
  },
  output:{
    path: path.join(__dirname, "./app/assets/javascript"),
    filename: '[name].js',
  },
  resolve: {
      alias: {
          jquery:             bower_dir + '/jquery/dist/jquery.js',
          foundation:         bower_dir + '/foundation-sites/dist/foundation.js',
          smoothState:        bower_dir + '/smoothState/src/jquery.smoothState.js',
          whatInput:          bower_dir + '/what-input/what-input.js',
          ScrollMagic:        bower_dir + '/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
          velocity:           bower_dir + '/velocity/velocity.js',
          velocityUi:         bower_dir + '/velocity/velocity.ui.js',
          scrollMonitor:      bower_dir + '/scrollMonitor/scrollMonitor.js'
      }
  },
  debug: true,
  devtool: 'source-map',
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": "jquery"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      filename: 'commons.bundles.js',
      minChunks: Infinity
    })
  ]
}
