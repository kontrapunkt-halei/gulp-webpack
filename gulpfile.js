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

// global paths
var paths = {
  app:{
    'sass':     globals.dev + '/assets/scss',
    'css':      globals.dev + '/assets/css',
    'jade':     globals.dev + '/assets/views',
    'fonts':    globals.dev + '/assets/fonts',
    'images':   globals.dev + '/assets/images',
    'videos':   globals.dev + '/assets/videos',
    'scripts':  globals.dev + '/assets/scripts'
  },
  prod:{
    'css':      globals.prod + '/assets/css',
    'fonts':    globals.prod + '/assets/fonts',
    'images':   globals.prod + '/assets/images',
    'videos':   globals.prod + '/assets/videos'
  }
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
var dataPaths = JSON.parse(fs.readFileSync('app/assets/data' + '/data.json'));


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
    '!' + paths.app.jade + '/template-parts/*.jade'
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


// gulp webpack task
gulp.task('webpack', function(){
  return gulp.src('')
    .pipe(webpack(require('./webpack.config.js')))
    .on('error', function handleError() {
         this.emit('end'); // Recover from errors
       })
    .pipe(gulp.dest('app/assets/javascript/'));
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
      searchPath: ['app']
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
