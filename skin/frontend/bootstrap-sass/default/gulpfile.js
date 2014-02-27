var gulp = require('gulp'),
    sass = require('gulp-sass'),
    //compass = require('gulp-compass'), /* Needs Configuration */
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

// This is the gulp.task API which is used to create tasks. The above can run from Terminal with $ gulp sass.

gulp.task('sass', function() {
  return gulp.src('./scss/style.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sass().on("error", notify.onError(function (error) {
		return "Error compiling SCSS: " + error.message;
	})))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Successfully compiled SCSS' }));
});

// Compass Support (Needs Configuration)
// load your compass config.rb file. Please make sure css_dir and sass_dir value on config.rb file.

// css_dir default value is css.
// sass_dir default value is sass.
// if css_dir value is stylesheets, please add css key as your define.
/*
var compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            css: 'app/assets/css',
            sass: 'app/assets/sass',
            image: 'app/assets/images'
            // Support multiple require option
            //require: ['susy', 'modular-scale']
        }))
        .on('error', function(err) {
            // Would like to catch the error here
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/assets/temp'));
});
*/


gulp.task('js', function() {
	return gulp.src([
			// All Scripts
			'bower_components/jquery/**/*.js',
			'bower_components/jquery/bootstrap/js/**/*.js',
			'js/script.js'
			// We could also do each one individually
			//'bower_components/jquery/jquery.js',
			//'bower_components/boostrap-sass-official/vendor/assets/javascripts/bootstraptransition.js',
			//'bower_components/boostrap-sass-official/vendor/assets/javascripts/bootstrapcollapse.js',
			//'bower_components/boostrap-sass-official/vendor/assets/javascripts/bootstrapcarousel.js',
			//'bower_components/boostrap-sass-official/vendor/assets/javascripts/bootstrapdropdown.js',
			//'bower_components/boostrap-sass-official/vendor/assets/javascripts/bootstrapmodal.js',
			
		])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('script.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(livereload(server))
		.pipe(notify({ message: 'Successfully compiled JS'}));
});

gulp.task('lint', function() {
	gulp
		.src('js/script.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
  return gulp.src(['dist/css', 'dist/js'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('sass', 'lint', 'js');
});


gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('js/**/*.js', ['scripts']);

  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);

   // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };

    // Watch tasks go inside inside server.listen()

  });

});


gulp.task('default', ['sass', 'lint', 'js', 'clean'], function() {

	gulp.watch('scss/**/*.scss', function() {
		gulp.run('sass');
	});

	gulp.watch('js/**/*.js', function() {
		gulp.run('lint');
		gulp.run('js');
	});
});


