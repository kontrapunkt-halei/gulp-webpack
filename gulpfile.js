var beeper            = require('beeper');
var del               = require('del');
var imageminJpegtran  = require('imagemin-jpegtran');
var gulp              = require('gulp');
var pngquant          = require('pngquant');
var fs                = require('fs');
var webpack           = require('webpack-stream');

var cache             = require('gulp-cache');
var sass              = require('gulp-sass');
var jade              = require('gulp-jade');
var sourcemaps        = require('gulp-sourcemaps');
var autoprefixer      = require('gulp-autoprefixer');
var imagemin          = require('gulp-imagemin');
var browserSync       = require('browser-sync').create();
var plumber           = require('gulp-plumber');
var gulpData          = require('gulp-data');
var gulpIf            = require('gulp-if');
var useref            = require('gulp-useref');
var cssnano           = require('gulp-cssnano');
var gulpUglify        = require('gulp-uglify');



/*------------------------
VARIABLES
------------------------*/
var globals = {
  dev: 'app',
  prod: 'dist'
};


/*------------------------
browser sync task
------------------------*/
gulp.task('server', ['sass', /*'webpack',*/ 'jade'], function(){
  browserSync.init({
    server: globals.dev
  });

  gulp.watch([
    paths.app.sass + '/*.scss',
    paths.app.sass + '/**/*.scss',
  ],
  ['sass']);
  // watch jade and jade comps
  gulp.watch([
    paths.app.jade + '/*.jade',
    paths.app.jade + '/**/*.jade'],
    ['jade']).on('change', browserSync.reload);
  // watch js
  gulp.watch([
    paths.app.scripts + '/*.js',
    paths.app.scripts + '/**/*.js'],
    ['webpack']).on('change', browserSync.reload);
});

gulp.task('server:dist', [], function(){
  browserSync.init({
    server: globals.prod
  });
});

// global paths
var paths = {
  app:{
    'sass':     globals.dev + '/sass',
    'css':      globals.dev + '/css',
    'jade':     globals.dev + '/jade',
    'fonts':    globals.dev + '/fonts',
    'images':   globals.dev + '/images',
    'videos':   globals.dev + '/videos',
    'scripts':  globals.dev + '/scripts'
  },
  prod:{
    'css':      globals.prod + '/css',
    'fonts':    globals.prod + '/fonts',
    'images':   globals.prod + '/images',
    'videos':   globals.prod + '/videos'
  }
};

// foundation site path need fix
var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

// sass options
var sassOptions = {
  errLogToConsole: true,
  includePaths: sassPaths,
  outputStyle: 'nested'
};

// datas
var dataPaths = JSON.parse(fs.readFileSync('app/data' + '/data.json'));


// sass task
gulp.task('sass', function(){
  return gulp.src(paths.app.sass + '/app.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        beeper('***');
        this.emit('end');
    }}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.app.css))
    .pipe(browserSync.stream());
});

// jade task
gulp.task('jade', function(){
  return gulp.src([
    paths.app.jade + '/*.jade',
    '!' + paths.app.jade + '/header.jade',
    '!' + paths.app.jade + '/footer.jade',
    paths.app.jade + '/**/*.jade'
  ])
    .pipe(gulpData(function(file){
      return dataTest = dataPaths;
    }))
    .pipe(plumber({
      errorHandler: function (error) {
				console.log(error.message);
				beeper('***');
				this.emit('end');
		}}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(globals.dev));
});

// bower wire plugin
gulp.task('wiredep', function () {
  return gulp.src([
    paths.app.jade + '/header.jade',
    paths.app.jade + '/footer.jade'
  ])
    .pipe(wiredep({
    }))
    .pipe(gulp.dest(paths.app.jade));
});

// gulp webpack task
gulp.task('webpack', function(){
  return gulp.src('app/scripts/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        beeper('***');
        this.emit('end');
    }}))
    .pipe(gulp.dest('app/scripts/'));
})

// gulp graphic resources, fonts, images or videos.
gulp.task('fonts', function(){
  return gulp.src(paths.app.fonts + '/*')
    .pipe(gulp.dest(paths.prod.fonts));
});

gulp.task('images', function(){
  return gulp.src(paths.app.images + '/**/*')
    .pipe(cache(imagemin({
      progressive : true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]
    })))
    .pipe(gulp.dest(paths.prod.images));
})


gulp.task('videos', function(){
  return gulp.src(paths.app.videos + '/**/*')
    .pipe(gulp.dest(paths.prod.videos));
})

// copy the html file from dev to pro
gulp.task('html-copy', function(){
  return gulp.src(globals.dev + '/*.html')
    .pipe(useref({
      searchPath: ['app', 'app/bower_components']
    }))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.js', gulpUglify()))
    .pipe(gulp.dest(globals.prod));
})

gulp.task('del', function(){
  return del.sync(globals.prod);
})


gulp.task('default', ['server']);

gulp.task('publish', ['del', 'fonts', 'images', 'videos', 'html-copy']);
