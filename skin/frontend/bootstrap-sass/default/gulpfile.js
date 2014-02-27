var gulp = require('gulp');

var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var notify = require('gulp-notify');
var browserSync = require('browser-sync');

gulp.task('sass', function() {
	gulp
		.src('./scss/style.scss')
		.pipe(sass().on("error", notify.onError(function (error) {
			return "Error compiling SCSS: " + error.message;
		})))
		// .pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
		.pipe(notify({
			message: 'Successfully compiled SCSS'
		}));
});

gulp.task('lint', function() {
	gulp
		.src('js/script.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('js', function() {
	gulp
		.src([
			'bower_components/jquery/jquery.js',
			'bower_components/bootstrap/js/transition.js',
			'bower_components/bootstrap/js/collapse.js',
			'bower_components/bootstrap/js/carousel.js',
			'bower_components/bootstrap/js/dropdown.js',
			'bower_components/bootstrap/js/modal.js',
			'js/script.js'
		])
		.pipe(concat('script.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({
			message: 'Successfully compiled JS'
		}));
});

gulp.task('default', ['sass', 'lint', 'js'], function() {

	gulp.watch('scss/**/*.scss', function() {
		gulp.run('sass');
	});

	gulp.watch('js/**/*.js', function() {
		gulp.run('lint');
		gulp.run('js');
	});
});

gulp.task('browser-sync', function() {
  browserSync.init(['./css/*.css', './*.html'], { /* [1] */
    server: {
      baseDir: './' /* [2] */
    }
  });
});
